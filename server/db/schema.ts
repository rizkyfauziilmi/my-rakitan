import { relations } from 'drizzle-orm';
import {
  pgTable,
  text,
  timestamp,
  boolean,
  index,
  integer,
  pgEnum,
  uuid,
} from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  role: text('role'),
  banned: boolean('banned').default(false),
  banReason: text('ban_reason'),
  banExpires: timestamp('ban_expires'),
});

export const session = pgTable(
  'session',
  {
    id: text('id').primaryKey(),
    expiresAt: timestamp('expires_at').notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    impersonatedBy: text('impersonated_by'),
  },
  (table) => [index('session_userId_idx').on(table.userId)]
);

export const account = pgTable(
  'account',
  {
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index('account_userId_idx').on(table.userId)]
);

export const verification = pgTable(
  'verification',
  {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index('verification_identifier_idx').on(table.identifier)]
);

export const productENUM = pgEnum('product_enum', ['component', 'accessory', 'prebuilt']);
export type ProductType = (typeof productENUM)['enumValues'][number];
export const categoryProductENUM = pgEnum('category_product_enum', [
  // components
  'cpu',
  'motherboard',
  'ram',
  'storage',
  'gpu',
  'psu',
  'casing',
  'cooling',
  // accessories
  'monitor',
  'keyboard',
  'mouse',
  'headset',
  'speaker',
  // prebuilts
  'gaming_pc',
  'workstation_pc',
  'office_pc',
  'home_pc',
  'creator_pc',
  'server_pc',
  'mini_pc',
  'budget_pc',
  'highend_pc',
]);
export type CategoryProductType = (typeof categoryProductENUM)['enumValues'][number];
export const filteredCategories = (type: ProductType) => {
  const componentCategories: CategoryProductType[] = [
    'cpu',
    'motherboard',
    'ram',
    'storage',
    'gpu',
    'psu',
    'casing',
    'cooling',
  ];
  const accessoryCategories: CategoryProductType[] = [
    'monitor',
    'keyboard',
    'mouse',
    'headset',
    'speaker',
  ];
  const prebuiltCategories: CategoryProductType[] = [
    'gaming_pc',
    'workstation_pc',
    'office_pc',
    'home_pc',
    'creator_pc',
    'server_pc',
    'mini_pc',
    'budget_pc',
    'highend_pc',
  ];

  switch (type) {
    case 'component':
      return componentCategories;
    case 'accessory':
      return accessoryCategories;
    case 'prebuilt':
      return prebuiltCategories;
    default:
      return [];
  }
};
export const categoriesMap: Record<ProductType, CategoryProductType[]> = {
  component: filteredCategories('component'),
  accessory: filteredCategories('accessory'),
  prebuilt: filteredCategories('prebuilt'),
};

export const productsTable = pgTable('product', {
  id: uuid().primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  imageUrl: text('image_url'),
  price: integer().notNull(),
  stock: integer().default(0).notNull(),
  sold: integer().default(0).notNull(),
  type: productENUM('type').notNull(),
  category: categoryProductENUM('category').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const transactionStatusEnum = pgEnum('transaction_status_enum', [
  'belum_dibayar',
  'dikemas',
  'dikirim',
  'sampai',
  'dibatalkan',
]);
export type TransactionStatusType = (typeof transactionStatusEnum)['enumValues'][number];
export const transactionsTable = pgTable('transaction', {
  id: uuid().primaryKey().defaultRandom(),

  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),

  customPcId: uuid('custom_pc_id').references(() => customPcTable.id, { onDelete: 'set null' }),

  totalPrice: integer('total_price').notNull(),
  status: transactionStatusEnum('status').default('belum_dibayar').notNull(),
  address: text('address').notNull(),
  resi: text('resi'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const transactionItem = pgTable('transaction_item', {
  id: uuid().primaryKey().defaultRandom(),

  transactionId: uuid('transaction_id')
    .notNull()
    .references(() => transactionsTable.id, { onDelete: 'cascade' }),

  productId: uuid('product_id')
    .notNull()
    .references(() => productsTable.id, { onDelete: 'cascade' }),

  customPcItemId: uuid('custom_pc_id').references(() => customPcTable.id, { onDelete: 'set null' }),

  quantity: integer('quantity').notNull(),
  price: integer('price').notNull(), // harga per item saat transaksi
});

export const customPcTable = pgTable('custom_pc', {
  id: uuid().primaryKey().defaultRandom(),

  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),

  name: text('name').notNull(), // nama build
  notes: text('notes'), // catatan opsional
  totalPrice: integer('total_price').notNull().default(0),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const customPcItemTable = pgTable('custom_pc_item', {
  id: uuid().primaryKey().defaultRandom(),

  customPcId: uuid('custom_pc_id')
    .notNull()
    .references(() => customPcTable.id, { onDelete: 'cascade' }),

  productId: uuid('product_id')
    .notNull()
    .references(() => productsTable.id, { onDelete: 'cascade' }),

  quantity: integer('quantity').notNull().default(1),
  price: integer('price').notNull(), // harga per item saat ditambahkan
});

export const transactionRelations = relations(transactionsTable, ({ one, many }) => ({
  user: one(user, {
    fields: [transactionsTable.userId],
    references: [user.id],
  }),
  items: many(transactionItem),
  customPc: one(customPcTable, {
    fields: [transactionsTable.customPcId],
    references: [customPcTable.id],
  }),
}));

export const transactionItemRelations = relations(transactionItem, ({ one }) => ({
  transaction: one(transactionsTable, {
    fields: [transactionItem.transactionId],
    references: [transactionsTable.id],
  }),
  product: one(productsTable, {
    fields: [transactionItem.productId],
    references: [productsTable.id],
  }),
}));

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const customPcRelations = relations(customPcTable, ({ one, many }) => ({
  user: one(user, {
    fields: [customPcTable.userId],
    references: [user.id],
  }),
  items: many(customPcItemTable),

  transaction: one(transactionsTable, {
    fields: [customPcTable.id],
    references: [transactionsTable.customPcId],
  }),
}));

export const customPcItemRelations = relations(customPcItemTable, ({ one }) => ({
  customPc: one(customPcTable, {
    fields: [customPcItemTable.customPcId],
    references: [customPcTable.id],
  }),
  product: one(productsTable, {
    fields: [customPcItemTable.productId],
    references: [productsTable.id],
  }),
}));
