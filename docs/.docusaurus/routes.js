import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/docs',
    component: ComponentCreator('/docs', '137'),
    routes: [
      {
        path: '/docs',
        component: ComponentCreator('/docs', 'def'),
        routes: [
          {
            path: '/docs',
            component: ComponentCreator('/docs', '0f8'),
            routes: [
              {
                path: '/docs/',
                component: ComponentCreator('/docs/', 'e35'),
                exact: true
              },
              {
                path: '/docs/future-enhancements',
                component: ComponentCreator('/docs/future-enhancements', 'eae'),
                exact: true
              },
              {
                path: '/docs/home',
                component: ComponentCreator('/docs/home', 'e29'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/srs/appendices',
                component: ComponentCreator('/docs/srs/appendices', 'd49'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/srs/functional-requirements',
                component: ComponentCreator('/docs/srs/functional-requirements', '004'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/srs/interface-requirements',
                component: ComponentCreator('/docs/srs/interface-requirements', '7f2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/srs/introduction',
                component: ComponentCreator('/docs/srs/introduction', '2e6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/srs/non-functional-requirements',
                component: ComponentCreator('/docs/srs/non-functional-requirements', '92b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/srs/overall-description',
                component: ComponentCreator('/docs/srs/overall-description', '327'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/wireframes/components',
                component: ComponentCreator('/docs/wireframes/components', '8fb'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/wireframes/overview',
                component: ComponentCreator('/docs/wireframes/overview', '5a9'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/wireframes/screens',
                component: ComponentCreator('/docs/wireframes/screens', '6ea'),
                exact: true,
                sidebar: "tutorialSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/',
    component: ComponentCreator('/', 'e5f'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
