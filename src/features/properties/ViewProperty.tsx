import {
  FaDollarSign,
  FaBed,
  FaDoorOpen,
  FaMapMarkerAlt,
  FaTag,
  FaRulerCombined,
  FaSnowflake,
  FaCar,
  FaLock,
  FaSwimmingPool,
  FaChair,
  FaTree,
  FaUmbrellaBeach,
} from "react-icons/fa";
import { MdGarage } from "react-icons/md";
import { FaHouse, FaRegClipboard } from "react-icons/fa6";
import { usePropertyById } from "../addProperties/usePropertyById";
import Autoplay from "embla-carousel-autoplay";
import { IconType } from "react-icons";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useRef, useState } from "react";
import { Property } from "@/services/type";
import toast from "react-hot-toast";

interface ViewPropertyProps {
  propertyId: string;
  onClose: () => void;
}

interface PropertyItem {
  key: string;
  label: string;
  icon: IconType;
}

const getNestedProperty = (obj: Property, key: string) => {
  return key
    .split(".")
    .reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj);
};

const PropertyList: PropertyItem[] = [
  { key: "title", label: "Title", icon: FaHouse },
  { key: "price", label: "Price", icon: FaDollarSign },
  { key: "rooms", label: "Rooms", icon: FaDoorOpen },
  { key: "bathrooms", label: "Bathrooms", icon: FaBed },
  { key: "status", label: "Status", icon: FaTag },
  { key: "address", label: "Address", icon: FaMapMarkerAlt },
  { key: "priceType", label: "Price Type", icon: FaTag },
  { key: "propertyType", label: "Property Type", icon: FaHouse },
  { key: "propertySize", label: "Property Size", icon: FaRulerCombined },
  {
    key: "features.airConditioning",
    label: "Air Conditioning",
    icon: FaSnowflake,
  },
  { key: "features.balcony", label: "Balcony", icon: FaUmbrellaBeach },
  { key: "features.furnished", label: "Furnished", icon: FaChair },
  { key: "features.garage", label: "Garage", icon: MdGarage },
  { key: "features.garden", label: "Garden", icon: FaTree },
  { key: "features.parking", label: "Parking", icon: FaCar },
  { key: "features.security", label: "Security", icon: FaLock },
  {
    key: "features.swimmingPool",
    label: "Swimming Pool",
    icon: FaSwimmingPool,
  },
];

function ViewProperty({ propertyId, onClose }: ViewPropertyProps) {
  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));
  const { data: property, isPending, error } = usePropertyById({ propertyId });
  const [aspectRatios, setAspectRatios] = useState<Record<number, string>>({});

  const handleImageLoad = (index: number, img: HTMLImageElement) => {
    const aspectRatio = img.naturalWidth / img.naturalHeight;
    setAspectRatios((prev) => ({
      ...prev,
      [index]: aspectRatio > 1 ? "aspect-[20/9]" : "aspect-[9/16]",
    }));
  };

  if (isPending) return <div className="p-4">Loading property details...</div>;
  if (error)
    return <div className="p-4 text-red-500">Error: {error.message}</div>;
  if (!property) return <div className="p-4">Property not found</div>;
  console.log("Property data:", property);

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50 w-full h-screen bg-backdrop-color backdrop-blur-sm transition-all duration-500">
      <div className="w-full max-w-6xl h-[100vh] bg-white overflow-y-scroll rounded-lg shadow-lg p-12 transition-all duration-500">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">View Property</h2>
          <button
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>
        <div>
          <Carousel
            plugins={[plugin.current]}
            className="w-full max-w-full"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
          >
            <CarouselContent>
              {property.images && property.images.length > 0 ? (
                property.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <CardContent className="p-0">
                      <div
                        className={`relative w-full overflow-hidden rounded-lg ${
                          aspectRatios[index] || "aspect-[20/9]"
                        }`}
                      >
                        <img
                          src={image}
                          alt={`Property image ${index + 1}`}
                          className="absolute inset-0 w-full h-full object-cover"
                          onLoad={(e) =>
                            handleImageLoad(index, e.currentTarget)
                          }
                        />
                      </div>
                    </CardContent>
                  </CarouselItem>
                ))
              ) : (
                <CarouselItem>
                  <Card>
                    <CardContent className="p-0">
                      <img
                        src="/placeholder-image.jpg"
                        alt="Default property image"
                        className="w-full h-auto object-cover rounded-lg"
                      />
                    </CardContent>
                  </Card>
                </CarouselItem>
              )}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
          <div className="pb-6">
            <p className="tracking-normal text-sm/6 pt-6">
              {property.description}
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
              {PropertyList.filter((item) => {
                const value = getNestedProperty(property, item.key);
                return !item.key.startsWith("features.") || value === true;
              }).map((item) => {
                const value = getNestedProperty(property, item.key);
                return (
                  <span
                    className="border border-transparent rounded-lg flex gap-x-2 p-2 items-center bg-gray-300"
                    key={item.key}
                  >
                    <item.icon className="text-gray-600" />
                    <h3 className="font-medium">
                      {item.label}:{" "}
                      {value != null && value !== ""
                        ? typeof value === "number"
                          ? value.toLocaleString()
                          : typeof value === "boolean"
                            ? value ? "Yes" : "No"
                            : value
                        : "N/A"}
                    </h3>
                  </span>
                );
              })}
            </div>
          <div className="pt-6">
            <h3 className="text-lg font-semibold mb-2">Documents</h3>
            {property.documents && property.documents.length > 0 ? (
              property.documents.map((document) => (
                <div
                  className="p-2 px-4 border border-transparent rounded-lg flex items-center bg-gray-300 justify-between max-w-[60rem]"
                  key={document}
                >
                  {document}
                  <FaRegClipboard
                    className="cursor-pointer text-gray-600 hover:text-gray-800"
                    onClick={() => {
                      navigator.clipboard.writeText(document);
                      toast.success("Document URL copied to clipboard");
                    }}
                    aria-label="Copy document URL"
                  />
                </div>
              ))
            ) : (
              <span className="text-gray-500">No documents available</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewProperty;
