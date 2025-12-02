import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

console.log(
  'Function "daily-expiring-scanner" ready to scan and populate expiring items queue'
);

// Initialize Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase environment variables");
  Deno.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Configuration
const DEFAULT_DAYS_AHEAD = 7;
const BATCH_SIZE = 100;

// Type definitions
interface FoodItem {
  id: string;
  user_id: string;
  name: string;
  quantity: number;
  unit: string;
  expiration_date: string;
  category: string;
}

interface Cosmetic {
  id: string;
  user_id: string;
  name: string;
  expiry_date: string;
}

interface QueueRecord {
  food_item_id?: string;
  cosmetic_id?: string;
  user_id: string;
  chat_id: number;
  item_name: string;
  quantity: number;
  unit: string;
  expiration_date: string;
  category: string;
  days_until_expiry: number;
  notification_priority: "urgent" | "high" | "medium" | "low";
  status: string;
  scheduled_at: string;
}

// Function to determine notification priority based on days until expiry
function getNotificationPriority(
  daysUntilExpiry: number
): "urgent" | "high" | "medium" | "low" {
  if (daysUntilExpiry <= 0) return "urgent"; // Expires today or already expired
  if (daysUntilExpiry <= 2) return "high"; // Expires in 1-2 days
  if (daysUntilExpiry <= 6) return "medium"; // Expires in 3-6 days
  return "low"; // Expires in 7+ days
}

// Function to calculate days until expiry
function calculateDaysUntilExpiry(expirationDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiryDate = new Date(expirationDate);
  expiryDate.setHours(0, 0, 0, 0);

  const diffTime = expiryDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Function to fetch expiring food items within a date range
async function fetchExpiringFoodItems(
  startDateStr: string,
  endDateStr: string
): Promise<FoodItem[]> {
  const { data, error } = await supabase
    .from("food_items")
    .select("id, user_id, name, quantity, unit, expiration_date, category")
    .gte("expiration_date", startDateStr)
    .lte("expiration_date", endDateStr)
    .order("user_id");

  if (error) {
    console.error("Error fetching food items:", error);
    throw new Error(`Failed to fetch food items: ${error.message}`);
  }

  return data || [];
}

// Function to fetch expiring cosmetics within a date range
async function fetchExpiringCosmetics(
  startDateStr: string,
  endDateStr: string
): Promise<Cosmetic[]> {
  const { data, error } = await supabase
    .from("cosmetics")
    .select("id, user_id, name, expiry_date")
    .gte("expiry_date", startDateStr)
    .lte("expiry_date", endDateStr)
    .eq("status", "active")
    .not("expiry_date", "is", null)
    .order("user_id");

  if (error) {
    console.error("Error fetching cosmetics:", error);
    throw new Error(`Failed to fetch cosmetics: ${error.message}`);
  }

  return data || [];
}

// Function to get all chat_ids from users table
async function getAllChatIds(): Promise<number[]> {
  const { data: users, error } = await supabase
    .from("users")
    .select("chat_id")
    .not("chat_id", "is", null);

  if (error) {
    console.error("Error fetching chat_ids:", error);
    throw new Error(`Failed to fetch users: ${error.message}`);
  }

  return users?.map((user) => user.chat_id) || [];
}

// Function to insert items into queue in batches
async function insertIntoQueue(queueRecords: QueueRecord[]): Promise<number> {
  if (queueRecords.length === 0) {
    return 0;
  }

  let totalInserted = 0;

  for (let i = 0; i < queueRecords.length; i += BATCH_SIZE) {
    const batch = queueRecords.slice(i, i + BATCH_SIZE);

    const { error } = await supabase.from("expiring_items_queue").insert(batch);

    if (error) {
      console.error(`Error inserting batch ${i / BATCH_SIZE + 1}:`, error);
      // Continue with next batch instead of throwing
      continue;
    }

    totalInserted += batch.length;
    console.log(`Inserted batch ${i / BATCH_SIZE + 1}: ${batch.length} items`);
  }

  return totalInserted;
}

// Function to populate queue for all items in date range
async function populateQueue(): Promise<{
  processed: number;
  foodCount: number;
  cosmeticCount: number;
  error?: string;
}> {
  console.log(`Scanning items expiring in the next ${DEFAULT_DAYS_AHEAD} days`);

  // Calculate date range
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + DEFAULT_DAYS_AHEAD);
  endDate.setHours(23, 59, 59, 999);

  const startDateStr = startDate.toISOString().split("T")[0];
  const endDateStr = endDate.toISOString().split("T")[0];

  console.log(`Date range: ${startDateStr} to ${endDateStr}`);

  try {
    // Fetch both food items and cosmetics in parallel
    const [foodItems, cosmetics, chatIds] = await Promise.all([
      fetchExpiringFoodItems(startDateStr, endDateStr),
      fetchExpiringCosmetics(startDateStr, endDateStr),
      getAllChatIds(),
    ]);

    console.log(
      `Found ${foodItems.length} food items, ${cosmetics.length} cosmetics, and ${chatIds.length} users with chat_ids`
    );

    if (foodItems.length === 0 && cosmetics.length === 0) {
      return { processed: 0, foodCount: 0, cosmeticCount: 0 };
    }

    if (chatIds.length === 0) {
      console.log("No users with chat_ids found");
      return { processed: 0, foodCount: 0, cosmeticCount: 0 };
    }

    // Prepare queue records for food items - broadcast to all users
    const foodQueueRecords: QueueRecord[] = [];
    for (const item of foodItems) {
      const daysUntilExpiry = calculateDaysUntilExpiry(item.expiration_date);
      for (const chatId of chatIds) {
        foodQueueRecords.push({
          food_item_id: item.id,
          user_id: item.user_id,
          chat_id: chatId,
          item_name: item.name,
          quantity: item.quantity,
          unit: item.unit,
          expiration_date: item.expiration_date,
          category: item.category,
          days_until_expiry: daysUntilExpiry,
          notification_priority: getNotificationPriority(daysUntilExpiry),
          status: "pending",
          scheduled_at: new Date().toISOString(),
        });
      }
    }

    // Prepare queue records for cosmetics - broadcast to all users
    const cosmeticQueueRecords: QueueRecord[] = [];
    for (const item of cosmetics) {
      const daysUntilExpiry = calculateDaysUntilExpiry(item.expiry_date);
      for (const chatId of chatIds) {
        cosmeticQueueRecords.push({
          cosmetic_id: item.id,
          user_id: item.user_id,
          chat_id: chatId,
          item_name: item.name,
          quantity: 1,
          unit: "item",
          expiration_date: item.expiry_date,
          category: "cosmetics",
          days_until_expiry: daysUntilExpiry,
          notification_priority: getNotificationPriority(daysUntilExpiry),
          status: "pending",
          scheduled_at: new Date().toISOString(),
        });
      }
    }

    // Combine all queue records
    const allQueueRecords = [...foodQueueRecords, ...cosmeticQueueRecords];

    console.log(
      `Inserting ${allQueueRecords.length} queue records (${foodQueueRecords.length} food, ${cosmeticQueueRecords.length} cosmetics) for ${chatIds.length} users`
    );

    // Insert into queue
    const inserted = await insertIntoQueue(allQueueRecords);

    console.log(`Successfully inserted ${inserted} items into queue`);
    return {
      processed: inserted,
      foodCount: foodItems.length,
      cosmeticCount: cosmetics.length,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`Error populating queue:`, message);
    return { processed: 0, foodCount: 0, cosmeticCount: 0, error: message };
  }
}

// Main function handler
Deno.serve(async (req) => {
  const { method } = req;

  if (method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    console.log("Starting daily expiring items scan");

    // Cleanup old queue items (older than 7 days)
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 7);

    const { error: cleanupError } = await supabase
      .from("expiring_items_queue")
      .delete()
      .lt("created_at", cutoffDate.toISOString());

    if (cleanupError) {
      console.error("Error cleaning up old queue items:", cleanupError);
      // Continue despite cleanup error
    } else {
      console.log("Cleaned up old queue items");
    }

    // Populate queue with all expiring items
    const result = await populateQueue();

    console.log(
      `Daily scan completed. Total processed: ${result.processed} (${result.foodCount} food, ${result.cosmeticCount} cosmetics)`
    );

    return new Response(
      JSON.stringify({
        success: !result.error,
        total_processed: result.processed,
        food_items: result.foodCount,
        cosmetic_items: result.cosmeticCount,
        error: result.error,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("Unhandled error in daily-expiring-scanner:", err);
    const message =
      err instanceof Error ? err.message : "Internal Server Error";
    return new Response(
      JSON.stringify({
        success: false,
        error: message,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/daily-expiring-scanner' \
    --header 'Authorization: Bearer YOUR_ANON_KEY' \
    --header 'Content-Type: application/json'

  3. To set up as a cron job, add to your Supabase project:
     - Go to Database > Cron Jobs
     - Create a new cron job with schedule: '0 0 * * *' (runs daily at midnight)
     - SQL: SELECT net.http_post(
              url:='https://your-project.supabase.co/functions/v1/daily-expiring-scanner',
              headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb
            );
*/
