import { 
  type BusStop, type InsertBusStop,
  type BusRoute, type InsertBusRoute,
  type VehiclePosition, type InsertVehiclePosition,
  type TripUpdate, type InsertTripUpdate,
  type ServiceAlert, type InsertServiceAlert,
  type RecentSearch, type InsertRecentSearch,
  type FavoriteStop, type InsertFavoriteStop
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Bus stops
  getBusStop(id: string): Promise<BusStop | undefined>;
  getBusStops(): Promise<BusStop[]>;
  getNearbyStops(lat: number, lng: number, radius?: number): Promise<BusStop[]>;
  createBusStop(stop: InsertBusStop): Promise<BusStop>;
  updateBusStop(id: string, updates: Partial<BusStop>): Promise<BusStop | undefined>;

  // Bus routes
  getBusRoute(id: string): Promise<BusRoute | undefined>;
  getBusRoutes(): Promise<BusRoute[]>;
  getNightRoutes(): Promise<BusRoute[]>;
  createBusRoute(route: InsertBusRoute): Promise<BusRoute>;

  // Vehicle positions
  getVehiclePosition(id: string): Promise<VehiclePosition | undefined>;
  getVehiclePositions(): Promise<VehiclePosition[]>;
  getVehiclePositionsByRoute(routeId: string): Promise<VehiclePosition[]>;
  createVehiclePosition(position: InsertVehiclePosition): Promise<VehiclePosition>;
  updateVehiclePositions(positions: InsertVehiclePosition[]): Promise<void>;

  // Trip updates
  getTripUpdate(id: string): Promise<TripUpdate | undefined>;
  getTripUpdates(): Promise<TripUpdate[]>;
  getTripUpdatesByStop(stopId: string): Promise<TripUpdate[]>;
  createTripUpdate(update: InsertTripUpdate): Promise<TripUpdate>;
  updateTripUpdates(updates: InsertTripUpdate[]): Promise<void>;

  // Service alerts
  getServiceAlert(id: string): Promise<ServiceAlert | undefined>;
  getActiveServiceAlerts(): Promise<ServiceAlert[]>;
  getAlertsForRoute(routeId: string): Promise<ServiceAlert[]>;
  createServiceAlert(alert: InsertServiceAlert): Promise<ServiceAlert>;
  updateServiceAlert(id: string, updates: Partial<ServiceAlert>): Promise<ServiceAlert | undefined>;

  // Recent searches
  getRecentSearches(limit?: number): Promise<RecentSearch[]>;
  createRecentSearch(search: InsertRecentSearch): Promise<RecentSearch>;

  // Favorite stops
  getFavoriteStops(userId?: string): Promise<FavoriteStop[]>;
  addFavoriteStop(stop: InsertFavoriteStop): Promise<FavoriteStop>;
  removeFavoriteStop(stopId: string, userId?: string): Promise<boolean>;
  isFavoriteStop(stopId: string, userId?: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private busStops: Map<string, BusStop> = new Map();
  private busRoutes: Map<string, BusRoute> = new Map();
  private vehiclePositions: Map<string, VehiclePosition> = new Map();
  private tripUpdates: Map<string, TripUpdate> = new Map();
  private serviceAlerts: Map<string, ServiceAlert> = new Map();
  private recentSearches: RecentSearch[] = [];
  private favoriteStops: FavoriteStop[] = [];

  constructor() {
    this.initializeTestData();
  }

  private initializeTestData() {
    // Initialize some test data for development
    const testRoutes = [
      { id: "N10", routeNumber: "N10", routeName: "Leichhardt", isNightService: true, color: "#3B82F6", status: "active" as const },
      { id: "N50", routeNumber: "N50", routeName: "Manly", isNightService: true, color: "#8B5CF6", status: "active" as const },
      { id: "N60", routeNumber: "N60", routeName: "Hornsby", isNightService: true, color: "#F97316", status: "limited" as const },
      { id: "N80", routeNumber: "N80", routeName: "Bondi Jct", isNightService: true, color: "#22C55E", status: "active" as const },
      { id: "380", routeNumber: "380", routeName: "Circular Quay", isNightService: false, color: "#22C55E", status: "active" as const },
    ];

    const testStops = [
      { id: "200060", name: "Central Station - Eddy Ave", latitude: -33.8848, longitude: 151.2073, suburb: "Sydney", isFavorite: false },
      { id: "200069", name: "Wynyard Station - York St", latitude: -33.8647, longitude: 151.2068, suburb: "Sydney", isFavorite: false },
    ];

    // Sample trip updates for demonstration
    const now = new Date();
    const testTripUpdates = [
      {
        id: "trip1",
        tripId: "trip_n10_001",
        routeId: "N10",
        stopId: "200060",
        arrivalTime: new Date(now.getTime() + 3 * 60 * 1000), // 3 minutes from now
        departureTime: new Date(now.getTime() + 4 * 60 * 1000),
        delay: 0,
        isRealtime: true,
        timestamp: now
      },
      {
        id: "trip2",
        tripId: "trip_n50_001",
        routeId: "N50",
        stopId: "200060",
        arrivalTime: new Date(now.getTime() + 8 * 60 * 1000), // 8 minutes from now
        departureTime: new Date(now.getTime() + 9 * 60 * 1000),
        delay: 120, // 2 minutes delay
        isRealtime: true,
        timestamp: now
      },
      {
        id: "trip3",
        tripId: "trip_380_001",
        routeId: "380",
        stopId: "200060",
        arrivalTime: new Date(now.getTime() + 12 * 60 * 1000), // 12 minutes from now
        departureTime: new Date(now.getTime() + 13 * 60 * 1000),
        delay: 0,
        isRealtime: false,
        timestamp: now
      },
      {
        id: "trip4",
        tripId: "trip_n60_001",
        routeId: "N60",
        stopId: "200060",
        arrivalTime: new Date(now.getTime() + 18 * 60 * 1000), // 18 minutes from now
        departureTime: new Date(now.getTime() + 19 * 60 * 1000),
        delay: 0,
        isRealtime: true,
        timestamp: now
      }
    ];

    testRoutes.forEach(route => this.busRoutes.set(route.id, route));
    testStops.forEach(stop => this.busStops.set(stop.id, stop));
    testTripUpdates.forEach(update => this.tripUpdates.set(update.id, update));
  }

  // Bus stops
  async getBusStop(id: string): Promise<BusStop | undefined> {
    return this.busStops.get(id);
  }

  async getBusStops(): Promise<BusStop[]> {
    return Array.from(this.busStops.values());
  }

  async getNearbyStops(lat: number, lng: number, radius: number = 1): Promise<BusStop[]> {
    return Array.from(this.busStops.values()).filter(stop => {
      const distance = Math.sqrt(
        Math.pow(stop.latitude - lat, 2) + Math.pow(stop.longitude - lng, 2)
      );
      return distance <= radius;
    });
  }

  async createBusStop(insertStop: InsertBusStop): Promise<BusStop> {
    const id = randomUUID();
    const stop: BusStop = { 
      ...insertStop, 
      id,
      suburb: insertStop.suburb ?? null,
      isFavorite: insertStop.isFavorite ?? false
    };
    this.busStops.set(id, stop);
    return stop;
  }

  async updateBusStop(id: string, updates: Partial<BusStop>): Promise<BusStop | undefined> {
    const stop = this.busStops.get(id);
    if (!stop) return undefined;
    const updated = { ...stop, ...updates };
    this.busStops.set(id, updated);
    return updated;
  }

  // Bus routes
  async getBusRoute(id: string): Promise<BusRoute | undefined> {
    return this.busRoutes.get(id);
  }

  async getBusRoutes(): Promise<BusRoute[]> {
    return Array.from(this.busRoutes.values());
  }

  async getNightRoutes(): Promise<BusRoute[]> {
    return Array.from(this.busRoutes.values()).filter(route => route.isNightService);
  }

  async createBusRoute(insertRoute: InsertBusRoute): Promise<BusRoute> {
    const id = randomUUID();
    const route: BusRoute = { 
      ...insertRoute, 
      id,
      color: insertRoute.color ?? "#1565C0",
      status: insertRoute.status ?? "active",
      isNightService: insertRoute.isNightService ?? false
    };
    this.busRoutes.set(id, route);
    return route;
  }

  // Vehicle positions
  async getVehiclePosition(id: string): Promise<VehiclePosition | undefined> {
    return this.vehiclePositions.get(id);
  }

  async getVehiclePositions(): Promise<VehiclePosition[]> {
    return Array.from(this.vehiclePositions.values());
  }

  async getVehiclePositionsByRoute(routeId: string): Promise<VehiclePosition[]> {
    return Array.from(this.vehiclePositions.values()).filter(pos => pos.routeId === routeId);
  }

  async createVehiclePosition(insertPosition: InsertVehiclePosition): Promise<VehiclePosition> {
    const id = randomUUID();
    const position: VehiclePosition = { 
      ...insertPosition, 
      id,
      speed: insertPosition.speed ?? null,
      bearing: insertPosition.bearing ?? null
    };
    this.vehiclePositions.set(id, position);
    return position;
  }

  async updateVehiclePositions(positions: InsertVehiclePosition[]): Promise<void> {
    // Clear existing positions and add new ones
    this.vehiclePositions.clear();
    for (const pos of positions) {
      await this.createVehiclePosition(pos);
    }
  }

  // Trip updates
  async getTripUpdate(id: string): Promise<TripUpdate | undefined> {
    return this.tripUpdates.get(id);
  }

  async getTripUpdates(): Promise<TripUpdate[]> {
    return Array.from(this.tripUpdates.values());
  }

  async getTripUpdatesByStop(stopId: string): Promise<TripUpdate[]> {
    return Array.from(this.tripUpdates.values()).filter(update => update.stopId === stopId);
  }

  async createTripUpdate(insertUpdate: InsertTripUpdate): Promise<TripUpdate> {
    const id = randomUUID();
    const update: TripUpdate = { 
      ...insertUpdate, 
      id,
      arrivalTime: insertUpdate.arrivalTime ?? null,
      departureTime: insertUpdate.departureTime ?? null,
      delay: insertUpdate.delay ?? 0,
      isRealtime: insertUpdate.isRealtime ?? false
    };
    this.tripUpdates.set(id, update);
    return update;
  }

  async updateTripUpdates(updates: InsertTripUpdate[]): Promise<void> {
    // Clear existing updates and add new ones
    this.tripUpdates.clear();
    for (const update of updates) {
      await this.createTripUpdate(update);
    }
  }

  // Service alerts
  async getServiceAlert(id: string): Promise<ServiceAlert | undefined> {
    return this.serviceAlerts.get(id);
  }

  async getActiveServiceAlerts(): Promise<ServiceAlert[]> {
    return Array.from(this.serviceAlerts.values()).filter(alert => alert.isActive);
  }

  async getAlertsForRoute(routeId: string): Promise<ServiceAlert[]> {
    return Array.from(this.serviceAlerts.values()).filter(alert => 
      alert.affectedRoutes?.includes(routeId) && alert.isActive
    );
  }

  async createServiceAlert(insertAlert: InsertServiceAlert): Promise<ServiceAlert> {
    const id = randomUUID();
    const alert: ServiceAlert = { 
      ...insertAlert, 
      id, 
      createdAt: new Date(),
      affectedRoutes: insertAlert.affectedRoutes ?? null,
      affectedStops: insertAlert.affectedStops ?? null,
      startTime: insertAlert.startTime ?? null,
      endTime: insertAlert.endTime ?? null,
      isActive: insertAlert.isActive ?? true
    };
    this.serviceAlerts.set(id, alert);
    return alert;
  }

  async updateServiceAlert(id: string, updates: Partial<ServiceAlert>): Promise<ServiceAlert | undefined> {
    const alert = this.serviceAlerts.get(id);
    if (!alert) return undefined;
    const updated = { ...alert, ...updates };
    this.serviceAlerts.set(id, updated);
    return updated;
  }

  // Recent searches
  async getRecentSearches(limit: number = 10): Promise<RecentSearch[]> {
    return this.recentSearches
      .sort((a, b) => (b.timestamp?.getTime() || 0) - (a.timestamp?.getTime() || 0))
      .slice(0, limit);
  }

  async createRecentSearch(insertSearch: InsertRecentSearch): Promise<RecentSearch> {
    const search: RecentSearch = { 
      ...insertSearch, 
      id: randomUUID(), 
      timestamp: new Date(),
      metadata: insertSearch.metadata ?? null
    };
    this.recentSearches.push(search);
    // Keep only last 50 searches
    if (this.recentSearches.length > 50) {
      this.recentSearches = this.recentSearches.slice(-50);
    }
    return search;
  }

  // Favorite stops
  async getFavoriteStops(userId: string = "default"): Promise<FavoriteStop[]> {
    return this.favoriteStops.filter(fav => fav.userId === userId);
  }

  async addFavoriteStop(insertFavorite: InsertFavoriteStop): Promise<FavoriteStop> {
    const favorite: FavoriteStop = { 
      ...insertFavorite, 
      id: randomUUID(), 
      addedAt: new Date(),
      userId: insertFavorite.userId ?? "default"
    };
    this.favoriteStops.push(favorite);
    return favorite;
  }

  async removeFavoriteStop(stopId: string, userId: string = "default"): Promise<boolean> {
    const index = this.favoriteStops.findIndex(fav => 
      fav.stopId === stopId && fav.userId === userId
    );
    if (index >= 0) {
      this.favoriteStops.splice(index, 1);
      return true;
    }
    return false;
  }

  async isFavoriteStop(stopId: string, userId: string = "default"): Promise<boolean> {
    return this.favoriteStops.some(fav => 
      fav.stopId === stopId && fav.userId === userId
    );
  }
}

export const storage = new MemStorage();
