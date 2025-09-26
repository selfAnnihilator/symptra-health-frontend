import { useState, useEffect, useRef } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Search, Phone, Clock, Star, Heart, ArrowUpRight, Loader2, LocateFixed } from "lucide-react";
import { toast } from "sonner";

const GOOGLE_MAPS_API_KEY = "AIzaSyDbS4ONjoVIsXxNYtnvaZcD56F1BULitYM";

const Hospitals = () => {
  const [searchInput, setSearchInput] = useState("");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [displayHospitals, setDisplayHospitals] = useState<any[]>([]);
  const [mapScriptLoaded, setMapScriptLoaded] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);

  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY) {
      toast.error("Google Maps API Key is missing or invalid.");
      return;
    }
    if (!mapScriptLoaded && !(window as any).google?.maps) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initGoogleMapCallback`;
      script.async = true;
      script.defer = true;
      (window as any).initGoogleMapCallback = () => setMapScriptLoaded(true);
      script.onerror = () => toast.error("Failed to load Google Maps script.");
      document.head.appendChild(script);
      return () => {
        document.head.removeChild(script);
        delete (window as any).initGoogleMapCallback;
      };
    } else if ((window as any).google?.maps && !mapScriptLoaded) {
      setMapScriptLoaded(true);
    }
  }, [mapScriptLoaded]);

  useEffect(() => {
    if (mapScriptLoaded && mapRef.current) {
      if (!mapInstanceRef.current) {
        const initialCenter = userLocation || { lat: 34.052235, lng: -118.243683 };
        mapInstanceRef.current = new (window as any).google.maps.Map(mapRef.current, {
          center: initialCenter,
          zoom: userLocation ? 13 : 10,
        });
      }
      if (inputRef.current && !(autocompleteRef.current)) {
        autocompleteRef.current = new (window as any).google.maps.places.Autocomplete(inputRef.current!, {
          types: ["establishment"],
        });
        autocompleteRef.current.addListener("place_changed", () => {
          const place = autocompleteRef.current.getPlace();
          if (place && place.name) {
            setSearchInput(place.name);
            fetchHospitalsByKeyword(place.name);
          }
        });
      }
    }
  }, [mapScriptLoaded, userLocation]);

  const fetchHospitalsByKeyword = (query: string) => {
    if (!mapInstanceRef.current) return;
    const service = new (window as any).google.maps.places.PlacesService(mapInstanceRef.current);
    const request = {
      location: userLocation || new (window as any).google.maps.LatLng(34.052235, -118.243683),
      radius: 10000,
      keyword: query,
      type: ["hospital"],
    };
    service.nearbySearch(request, (results: any, status: any) => {
      if (status === (window as any).google.maps.places.PlacesServiceStatus.OK) {
        const hospitals = results.map((place: any, index: number) => ({
          id: index + 1,
          name: place.name,
          address: place.vicinity,
          distance: "N/A",
          rating: place.rating || 0,
          phone: "",
          hours: place.opening_hours?.open_now ? "Open Now" : "Closed",
          services: [],
          isFavorite: false,
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        }));
        setDisplayHospitals(hospitals);
        updateMapMarkers(hospitals);
      } else {
        toast.error("No hospitals found for the given search.");
      }
    });
  };

  const updateMapMarkers = (hospitals = displayHospitals) => {
    if (!mapInstanceRef.current || !(window as any).google?.maps) return;
    if (mapInstanceRef.current.markers) {
      mapInstanceRef.current.markers.forEach((m: any) => m.setMap(null));
    }
    mapInstanceRef.current.markers = [];
    hospitals.forEach(hospital => {
      const marker = new (window as any).google.maps.Marker({
        position: { lat: hospital.lat, lng: hospital.lng },
        map: mapInstanceRef.current,
        title: hospital.name,
      });
      mapInstanceRef.current.markers.push(marker);
    });
  };

  const findMyNearestHospitals = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported.");
      return;
    }
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        fetchHospitalsByKeyword("hospital");
        toast.success("Found your location!");
        setLocationLoading(false);
      },
      () => {
        toast.error("Failed to get location.");
        setLocationLoading(false);
      }
    );
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      fetchHospitalsByKeyword(searchInput);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Navigation />
      <div className="container mx-auto pt-24 px-4 pb-12">
        <h1 className="text-3xl font-bold text-healthcare-dark mb-6">Find Hospitals & Healthcare Providers</h1>
        <form onSubmit={handleSearchSubmit} className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input ref={inputRef} value={searchInput} onChange={e => setSearchInput(e.target.value)} className="pl-10 w-full" placeholder="Search hospitals by keyword..." />
          </div>
          <Button type="submit" className="flex items-center gap-2">
            <Search className="h-4 w-4" /> Search
          </Button>
          <Button onClick={findMyNearestHospitals} disabled={locationLoading} className="flex items-center gap-2" type="button">
            {locationLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Finding Location...</> : <><LocateFixed className="h-4 w-4" /> Find Nearby</>}
          </Button>
        </form>
        <Tabs defaultValue="map" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
            <TabsTrigger value="map">Map View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
          <TabsContent value="map">
            <Card className="shadow-md mb-6">
              <CardContent className="p-6">
                <div ref={mapRef} className="w-full h-[400px] bg-gray-100 rounded-lg relative overflow-hidden"></div>
              </CardContent>
            </Card>
            <div className="grid grid-cols-1 gap-4">
              {displayHospitals.map(h => (
                <Card key={h.id} className="shadow-sm hover:shadow-md transition-all">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{h.name}</h3>
                        <p className="text-gray-500 text-sm flex items-center"><MapPin className="h-3.5 w-3.5 mr-1" /> {h.address}</p>
                        <p className="text-sm text-healthcare-primary">{h.distance}</p>
                      </div>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <Heart className={`h-5 w-5 ${h.isFavorite ? 'fill-healthcare-accent text-healthcare-accent' : 'text-gray-400'}`} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="list">
            <div className="space-y-4">
              {displayHospitals.length > 0 ? displayHospitals.map(h => (
                <Card key={h.id} className="shadow-md hover:shadow-lg transition-all">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div>
                        <CardTitle>{h.name}</CardTitle>
                        <CardDescription className="flex items-center"><MapPin className="h-3.5 w-3.5 mr-1" /> {h.address}</CardDescription>
                      </div>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <Heart className={`h-5 w-5 ${h.isFavorite ? 'fill-healthcare-accent text-healthcare-accent' : 'text-gray-400'}`} />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col space-y-2 mb-3">
                      <div className="flex items-center text-sm"><Phone className="h-3.5 w-3.5 mr-2 text-healthcare-primary" /><span>{h.phone || 'N/A'}</span></div>
                      <div className="flex items-center text-sm"><Clock className="h-3.5 w-3.5 mr-2 text-healthcare-primary" /><span>{h.hours}</span></div>
                      <div className="flex items-center text-sm"><Star className="h-3.5 w-3.5 mr-2 text-healthcare-primary" /><span>{h.rating} stars</span></div>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">Call</Button>
                      <Button variant="outline" size="sm" className="flex-1">Directions</Button>
                      <Button size="sm" className="flex-1">Details <ArrowUpRight className="ml-1 h-3.5 w-3.5" /></Button>
                    </div>
                  </CardContent>
                </Card>
              )) : <div className="text-center py-12"><p className="text-gray-500">No hospitals found.</p></div>}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Hospitals;
