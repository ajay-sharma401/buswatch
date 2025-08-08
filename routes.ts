import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertRecentSearchSchema, insertFavoriteStopSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Bus stops
  app.get("/api/stops", async (req, res) => {
    try {
      const stops = await storage.getBusStops();
      res.json(stops);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bus stops" });
    }
  });

  app.get("/api/stops/nearby", async (req, res) => {
    try {
      const { lat, lng, radius } = req.query;
      if (!lat || !lng) {
        return res.status(400).json({ error: "Latitude and longitude required" });
      }
      
      const stops = await storage.getNearbyStops(
        parseFloat(lat as string), 
        parseFloat(lng as string),
        radius ? parseFloat(radius as string) : undefined
      );
      res.json(stops);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch nearby stops" });
    }
  });

  app.get("/api/stops/:id", async (req, res) => {
    try {
      const stop = await storage.getBusStop(req.params.id);
      if (!stop) {
        return res.status(404).json({ error: "Stop not found" });
      }
      res.json(stop);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stop" });
    }
  });

  // Bus routes
  app.get("/api/routes", async (req, res) => {
    try {
      const routes = await storage.getBusRoutes();
      res.json(routes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch routes" });
    }
  });

  app.get("/api/routes/night", async (req, res) => {
    try {
      const routes = await storage.getNightRoutes();
      res.json(routes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch night routes" });
    }
  });

  // Vehicle positions
  app.get("/api/vehicles", async (req, res) => {
    try {
      const positions = await storage.getVehiclePositions();
      res.json(positions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch vehicle positions" });
    }
  });

  app.get("/api/vehicles/route/:routeId", async (req, res) => {
    try {
      const positions = await storage.getVehiclePositionsByRoute(req.params.routeId);
      res.json(positions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch vehicle positions for route" });
    }
  });

  // Trip updates and arrival times
  app.get("/api/arrivals/stop/:stopId", async (req, res) => {
    try {
      const updates = await storage.getTripUpdatesByStop(req.params.stopId);
      res.json(updates);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch arrival times" });
    }
  });

  // Service alerts
  app.get("/api/alerts", async (req, res) => {
    try {
      const alerts = await storage.getActiveServiceAlerts();
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch service alerts" });
    }
  });

  app.get("/api/alerts/route/:routeId", async (req, res) => {
    try {
      const alerts = await storage.getAlertsForRoute(req.params.routeId);
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch alerts for route" });
    }
  });

  // Recent searches
  app.get("/api/searches/recent", async (req, res) => {
    try {
      const searches = await storage.getRecentSearches();
      res.json(searches);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch recent searches" });
    }
  });

  app.post("/api/searches", async (req, res) => {
    try {
      const searchData = insertRecentSearchSchema.parse(req.body);
      const search = await storage.createRecentSearch(searchData);
      res.json(search);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid search data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to save search" });
    }
  });

  // Favorite stops
  app.get("/api/favorites", async (req, res) => {
    try {
      const favorites = await storage.getFavoriteStops();
      res.json(favorites);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch favorite stops" });
    }
  });

  app.post("/api/favorites", async (req, res) => {
    try {
      const favoriteData = insertFavoriteStopSchema.parse(req.body);
      const favorite = await storage.addFavoriteStop(favoriteData);
      res.json(favorite);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid favorite data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to add favorite stop" });
    }
  });

  app.delete("/api/favorites/:stopId", async (req, res) => {
    try {
      const { stopId } = req.params;
      const { userId = "default" } = req.query;
      const removed = await storage.removeFavoriteStop(stopId, userId as string);
      if (!removed) {
        return res.status(404).json({ error: "Favorite stop not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to remove favorite stop" });
    }
  });

  // NSW Transport for NSW API integration endpoint
  app.get("/api/nsw/realtime", async (req, res) => {
    try {
      const apiKey = process.env.NSW_TRANSPORT_API_KEY || process.env.VITE_NSW_TRANSPORT_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "NSW Transport API key not configured" });
      }

      // This would integrate with NSW Transport for NSW real-time GTFS API
      // For now, return empty data structure
      res.json({
        vehiclePositions: [],
        tripUpdates: [],
        alerts: []
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch NSW Transport real-time data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
