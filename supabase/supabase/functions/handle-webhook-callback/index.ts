import { serve } from "https://deno.land/std/http/server.ts";
import { Bot } from "https://esm.sh/grammy@1.36.3";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

// Environment variables
const token = Deno.env.get('TELEGRAM_BOT_TOKEN') || '';
const bot = new Bot(token);

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl || '', supabaseKey || '');

// Logging helper
const logger = {
  info: (message: string, data?: any) => {
    console.log(`[handle-webhook-callback] ${message}`, data ? JSON.stringify(data, null, 2) : '');
  },
  error: (message: string, error?: any) => {
    console.error(`[handle-webhook-callback] ERROR: ${message}`, error?.message || error);
  },
  warn: (message: string, data?: any) => {
    console.warn(`[handle-webhook-callback] WARNING: ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }
};

// Initialize logging
logger.info('Function initialized', {
  hasToken: !!token,
  hasSupabaseUrl: !!supabaseUrl,
  hasSupabaseKey: !!supabaseKey
});

interface ExpiringItemsQueueRecord {
  id: string;
  food_item_id?: string;
  cosmetic_id?: string;
  user_id: string;
  chat_id: number;
  item_name: string;
  quantity: string | number;
  unit: string;
  expiration_date: string;
  category: string;
  days_until_expiry: number;
  notification_priority: 'urgent' | 'high' | 'medium' | 'low' | string;
  status: string;
  scheduled_at: string | null;
  processed_at: string | null;
  created_at: string;
  updated_at: string;
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch (error) {
    logger.warn('Failed to format date, using original', { dateString, error });
    return dateString;
  }
}

function formatTelegramMessage(record: ExpiringItemsQueueRecord): string {
  const { item_name, category, quantity, unit, expiration_date, days_until_expiry, notification_priority } = record;
  const normalizedQuantity = typeof quantity === 'number' ? quantity : Number(quantity) || 0;

  const priorityEmoji = notification_priority === 'urgent' ? '🚨' : '⚠️';
  const categoryEmoji = {
    'snacks': '🍪',
    'dairy': '🥛',
    'meat': '🥩',
    'vegetables': '🥕',
    'fruits': '🍎',
    'beverages': '🥤',
    'cosmetics': '💄',
    'other': '📦'
  }[category] || '📦';

  const formattedExpirationDate = formatDate(expiration_date);

  logger.info('Date formatting', {
    original: expiration_date,
    formatted: formattedExpirationDate
  });

  return `${priorityEmoji} *Item is coming date ${formattedExpirationDate}*\n\n${categoryEmoji} *Item:* ${item_name}\n📊 *Quantity:* ${normalizedQuantity} ${unit}\n📅 *Expires:* ${formattedExpirationDate}\n⏰ *Days until expiry:* ${days_until_expiry}\n\nCategory: ${category.charAt(0).toUpperCase() + category.slice(1)}`;
}

async function sendTelegramNotification(record: ExpiringItemsQueueRecord): Promise<boolean> {
  const isFoodItem = !!record.food_item_id;
  const isCosmeticItem = !!record.cosmetic_id;
  const itemId = record.food_item_id || record.cosmetic_id;

  logger.info('Starting Telegram notification', {
    item_type: isFoodItem ? 'food' : 'cosmetic',
    food_item_id: record.food_item_id,
    cosmetic_id: record.cosmetic_id,
    chat_id: record.chat_id,
    item_name: record.item_name
  });

  if (!token) {
    logger.warn('TELEGRAM_BOT_TOKEN is missing - cannot send notification');
    return false;
  }

  try {
    let imageUrl: string | null = null;
    let fetchError: any = null;

    if (isFoodItem && record.food_item_id) {
      logger.info('Fetching image_url from food_items table', { food_item_id: record.food_item_id });
      const { data, error } = await supabase
        .from('food_items')
        .select('image_url')
        .eq('id', record.food_item_id)
        .single();

      imageUrl = data?.image_url || null;
      fetchError = error;
    } else if (isCosmeticItem && record.cosmetic_id) {
      logger.info('Fetching image_url from cosmetics table', { cosmetic_id: record.cosmetic_id });
      const { data, error } = await supabase
        .from('cosmetics')
        .select('image_url')
        .eq('id', record.cosmetic_id)
        .single();

      imageUrl = data?.image_url || null;
      fetchError = error;
    }

    if (fetchError) {
      logger.error('Failed to fetch item image_url', {
        item_type: isFoodItem ? 'food' : 'cosmetic',
        item_id: itemId,
        error: fetchError
      });
    }

    const message = formatTelegramMessage(record);
    logger.info('Formatted message', {
      messageLength: message.length,
      hasImage: !!imageUrl,
      item_type: isFoodItem ? 'food' : 'cosmetic'
    });

    if (imageUrl) {
      logger.info('Sending photo message', {
        chat_id: record.chat_id,
        item_type: isFoodItem ? 'food' : 'cosmetic',
        image_url: imageUrl.substring(0, 50) + '...'
      });

      const result = await bot.api.sendPhoto(record.chat_id, imageUrl, {
        caption: message,
        parse_mode: 'Markdown'
      });

      logger.info('Photo message sent successfully', {
        chat_id: record.chat_id,
        message_id: result.message_id,
        item_type: isFoodItem ? 'food' : 'cosmetic'
      });
    } else {
      logger.info('Sending text message (no image available)', {
        chat_id: record.chat_id,
        item_type: isFoodItem ? 'food' : 'cosmetic',
        reason: fetchError ? 'fetch_error' : 'no_image_url'
      });

      const result = await bot.api.sendMessage(record.chat_id, message, {
        parse_mode: 'Markdown'
      });

      logger.info('Text message sent successfully', {
        chat_id: record.chat_id,
        message_id: result.message_id,
        item_type: isFoodItem ? 'food' : 'cosmetic'
      });
    }

    return true;
  } catch (error) {
    logger.error('Failed to send Telegram notification', {
      item_type: isFoodItem ? 'food' : 'cosmetic',
      item_id: itemId,
      error
    });
    return false;
  }
}

async function markQueueRecordAsSent(id: string): Promise<void> {
  const { error } = await supabase
    .from('expiring_items_queue')
    .update({ status: 'sent', processed_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    logger.error('Failed to update expiring_items_queue status', { id, error });
  }
}

serve(async (req) => {
  const startTime = Date.now();
  logger.info('=== New request received ===');
  logger.info('Request details', {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries())
  });

  if (req.method !== "POST") {
    logger.warn('Invalid method', { method: req.method, allowed: 'POST' });
    return new Response("Method Not Allowed", { status: 405 });
  }

  let payload;
  try {
    payload = await req.json();
    logger.info('Payload parsed successfully', {
      payloadSize: JSON.stringify(payload).length,
      hasRecord: !!payload.record,
      hasOldRecord: !!payload.old_record
    });
  } catch (err) {
    logger.error('Failed to parse JSON payload', err);
    return new Response("Bad Request: invalid JSON", { status: 400 });
  }

  const { type, table, schema, record, old_record } = payload;

  logger.info('Expiring items queue webhook event', {
    type,
    table,
    schema,
    recordId: record?.id,
    oldRecordId: old_record?.id,
    isExpiringQueueEvent: table === 'expiring_items_queue'
  });

  if (record) {
    logger.info('New record details', {
      id: record.id,
      item_name: record.item_name,
      category: record.category,
      chat_id: record.chat_id,
      food_item_id: record.food_item_id,
      cosmetic_id: record.cosmetic_id,
      expiration_date: record.expiration_date,
      formatted_expiration_date: formatDate(record.expiration_date),
      days_until_expiry: record.days_until_expiry
    });
  }

  if (old_record) {
    logger.info('Old record details', {
      id: old_record.id,
      item_name: old_record.item_name,
      category: old_record.category
    });
  }

  const shouldSendNotification = record && type === 'INSERT' && table === 'expiring_items_queue' && record.chat_id;

  logger.info('Notification decision', {
    hasRecord: !!record,
    isInsert: type === 'INSERT',
    isExpiringQueueTable: table === 'expiring_items_queue',
    hasChatId: !!record?.chat_id,
    shouldSendNotification
  });

  if (shouldSendNotification) {
    try {
      logger.info('Sending Telegram notification...');
      const sent = await sendTelegramNotification(record as ExpiringItemsQueueRecord);
      if (sent) {
        await markQueueRecordAsSent(record.id);
      }
      logger.info('Telegram notification completed');
    } catch (error) {
      logger.error('Error in sendTelegramNotification', error);
    }
  } else {
    logger.info('Skipping Telegram notification', {
      reason: !record ? 'no_record' :
              type !== 'INSERT' ? 'not_insert' :
              table !== 'expiring_items_queue' ? 'not_expiring_items_queue_table' :
              !record.chat_id ? 'no_chat_id' : 'unknown'
    });
  }

  const processingTime = Date.now() - startTime;
  logger.info('=== Request completed ===', {
    processingTimeMs: processingTime,
    status: 'success'
  });

  return new Response(JSON.stringify({ status: "ok" }), { status: 200 });
});
