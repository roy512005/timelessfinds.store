'use client';

import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { toast } from 'sonner';

// Fix leaflet icon paths
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapPickerProps {
    onSelectAddress: (address: { addressLine1: string, city: string, state: string, pincode: string }) => void;
    onClose: () => void;
}

// Map center tracking helper function
function MapUpdater({ position }: { position: L.LatLng }) {
    const map = useMapEvents({});
    map.setView(position, map.getZoom(), { animate: true });
    return null;
}

function LocationMarker({ position, setPosition }: { position: L.LatLng | null, setPosition: (pos: L.LatLng) => void }) {
    useMapEvents({
        click(e) {
            setPosition(e.latlng);
        },
    });

    return position === null ? null : (
        <Marker
            position={position}
            draggable={true}
            eventHandlers={{
                dragend: (e) => {
                    setPosition(e.target.getLatLng());
                }
            }}
        />
    );
}

export default function MapPicker({ onSelectAddress, onClose }: MapPickerProps) {
    const [position, setPosition] = useState<L.LatLng>(new L.LatLng(20.5937, 78.9629));
    const [isLocating, setIsLocating] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const handleUseCurrentLocation = () => {
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setPosition(new L.LatLng(pos.coords.latitude, pos.coords.longitude));
                setIsLocating(false);
                toast.success("Location found! Drag pin to adjust.");
            },
            (err) => {
                toast.error("Could not access your location. Please check browser permissions.");
                setIsLocating(false);
            }
        );
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery) return;
        setIsSearching(true);
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
            const data = await res.json();
            if (data && data.length > 0) {
                setPosition(new L.LatLng(data[0].lat, data[0].lon));
            } else {
                toast.error("Address not found. Please try a different query.");
            }
        } catch (error) {
            toast.error("Error searching address");
        }
        setIsSearching(false);
    };

    const handleConfirm = async () => {
        if (!position) return;

        toast.loading("Getting address details...", { id: 'geocoding' });
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}`);
            const data = await res.json();

            if (data && data.address) {
                const addr = data.address;
                const building = addr.building || addr.house_number || '';
                const road = addr.road || addr.pedestrian || addr.suburb || addr.neighbourhood || '';
                const city = addr.city || addr.town || addr.village || addr.county || '';
                const state = addr.state || '';
                const pincode = addr.postcode || '';

                const line1 = [building, road].filter(Boolean).join(', ');

                toast.dismiss('geocoding');
                onSelectAddress({
                    addressLine1: line1 || data.display_name.split(',')[0] || '',
                    city,
                    state,
                    pincode
                });
                onClose();
            } else {
                toast.dismiss('geocoding');
                toast.error("Could not trace exact address details. Please fill manually.");
                onClose();
            }
        } catch (error) {
            toast.dismiss('geocoding');
            toast.error("Failed to convert location to address.");
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white w-full max-w-2xl rounded-sm shadow-2xl overflow-hidden flex flex-col">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white">
                    <h3 className="font-bold text-gray-900 text-lg font-serif">Select Delivery Location</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors" aria-label="Close map">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="p-4 bg-gray-50 flex flex-col sm:flex-row gap-3">
                    <form onSubmit={handleSearch} className="flex flex-1 gap-2">
                        <input
                            type="text"
                            placeholder="Search area, street, or landmark"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 px-4 py-3 text-sm border border-gray-200 focus:border-black outline-none bg-white rounded-sm"
                        />
                        <button disabled={isSearching || !searchQuery} className="bg-black text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-rose-600 transition-colors disabled:opacity-50">
                            Search
                        </button>
                    </form>
                    <button onClick={handleUseCurrentLocation} disabled={isLocating} className="bg-blue-50 text-blue-700 border border-blue-200 px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-blue-100 transition-colors disabled:opacity-50 flex items-center justify-center whitespace-nowrap rounded-sm">
                        📍 Detect
                    </button>
                </div>

                <div className="h-[400px] w-full bg-gray-100 relative">
                    <MapContainer center={position} zoom={5} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <LocationMarker position={position} setPosition={setPosition} />
                        <MapUpdater position={position} />
                    </MapContainer>
                    <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-2 text-[10px] uppercase font-bold text-gray-700 rounded shadow pointer-events-none z-[1000] border border-gray-200">
                        Drag the pin to adjust precisely
                    </div>
                </div>

                <div className="p-5 border-t border-gray-100 flex justify-end gap-4 bg-white">
                    <button onClick={onClose} className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-widest hover:text-black hover:bg-gray-50 transition-colors rounded-sm">
                        Cancel
                    </button>
                    <button onClick={handleConfirm} disabled={!position} className="px-8 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-rose-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed rounded-sm">
                        Confirm Address
                    </button>
                </div>
            </div>
        </div>
    );
}
