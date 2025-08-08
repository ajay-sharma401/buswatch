import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, real, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const busStops = pgTable("bus_stops", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  suburb: text("suburb"),
  isFavorite: boolean("is_favorite").default(false),
});

export const busRoutes = pgTable("bus_routes", {
  id: varchar("id").primaryKey(),
  routeNumber: text("route_number").notNull(),
  routeName: text("route_name").notNull(),
  isNightService: boolean("is_night_service").default(false),
  color: varchar("color", { length: 7 }).default("#1565C0"),
  status: varchar("status", { length: 20 }).default("active"), // active, limited, inactive
});

export const vehiclePositions = pgTable("vehicle_positions", {
  id: varchar("id").primaryKey(),
  vehicleId: varchar("vehicle_id").notNull(),
  routeId: varchar("route_id").notNull(),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  bearing: real("bearing"),
  speed: real("speed"),
  timestamp: timestamp("timestamp").notNull(),
});

export const tripUpdates = pgTable("trip_updates", {
  id: varchar("id").primaryKey(),
  tripId: varchar("trip_id").notNull(),
  routeId: varchar("route_id").notNull(),
  stopId: varchar("stop_id").notNull(),
  arrivalTime: timestamp("arrival_time"),
  departureTime: timestamp("departure_time"),
  delay: integer("delay").default(0), // in seconds
  isRealtime: boolean("is_realtime").default(false),
  timestamp: timestamp("timestamp").notNull(),
});

export const serviceAlerts = pgTable("service_alerts", {
  id: varchar("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  severity: varchar("severity", { length: 20 }).notNull(), // info, warning, critical
  affectedRoutes: jsonb("affected_routes").$type<string[]>(),
  affectedStops: jsonb("affected_stops").$type<string[]>(),
  startTime: timestamp("start_time"),
  endTime: timestamp("end_time"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const recentSearches = pgTable("recent_searches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  query: text("query").notNull(),
  searchType: varchar("search_type", { length: 20 }).notNull(), // route, stop, destination
  metadata: jsonb("metadata"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const favoriteStops = pgTable("favorite_stops", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  stopId: varchar("stop_id").notNull(),
  userId: varchar("user_id").default("default"), // for future user support
  addedAt: timestamp("added_at").defaultNow(),
});

// Insert schemas
export const insertBusStopSchema = createInsertSchema(busStops).omit({ id: true });
export const insertBusRouteSchema = createInsertSchema(busRoutes).omit({ id: true });
export const insertVehiclePositionSchema = createInsertSchema(vehiclePositions).omit({ id: true });
export const insertTripUpdateSchema = createInsertSchema(tripUpdates).omit({ id: true });
export const insertServiceAlertSchema = createInsertSchema(serviceAlerts).omit({ id: true, createdAt: true });
export const insertRecentSearchSchema = createInsertSchema(recentSearches).omit({ id: true, timestamp: true });
export const insertFavoriteStopSchema = createInsertSchema(favoriteStops).omit({ id: true, addedAt: true });

// Types
export type BusStop = typeof busStops.$inferSelect;
export type InsertBusStop = z.infer<typeof insertBusStopSchema>;
export type BusRoute = typeof busRoutes.$inferSelect;
export type InsertBusRoute = z.infer<typeof insertBusRouteSchema>;
export type VehiclePosition = typeof vehiclePositions.$inferSelect;
export type InsertVehiclePosition = z.infer<typeof insertVehiclePositionSchema>;
export type TripUpdate = typeof tripUpdates.$inferSelect;
export type InsertTripUpdate = z.infer<typeof insertTripUpdateSchema>;
export type ServiceAlert = typeof serviceAlerts.$inferSelect;
export type InsertServiceAlert = z.infer<typeof insertServiceAlertSchema>;
export type RecentSearch = typeof recentSearches.$inferSelect;
export type InsertRecentSearch = z.infer<typeof insertRecentSearchSchema>;
export type FavoriteStop = typeof favoriteStops.$inferSelect;
export type InsertFavoriteStop = z.infer<typeof insertFavoriteStopSchema>;
