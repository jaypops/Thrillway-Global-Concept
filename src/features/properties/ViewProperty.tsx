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
import { usePropertyById } from "../usePropertyById";
import Autoplay from "embla-carousel-autoplay";
import { IconType } from "react-icons";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect, useRef, useState } from "react";
import { Property } from "@/services/type";
import toast from "react-hot-toast";
import Loader from "@/ui/Loader";
import { useNavigate, useParams } from "react-router-dom";

interface PropertyItem {
  key: string;
  label: string;
  icon: IconType;
}

const getNestedProperty = (obj: Property, key: string): any => {
  return key.split(".").reduce((o: any, k: string) => {
    if (o && typeof o === "object" && k in o) {
      return o[k];
    }
    return undefined;
  }, obj);
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

function ViewProperty() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const propertyId = id!;
  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));
  const { data: property, isPending, error } = usePropertyById({ propertyId });
  const [aspectRatios, setAspectRatios] = useState<Record<number, string>>({});

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleImageLoad = (index: number, img: HTMLImageElement) => {
    const aspectRatio = img.naturalWidth / img.naturalHeight;
    setAspectRatios((prev) => ({
      ...prev,
      [index]: aspectRatio > 1 ? "aspect-[20/9]" : "aspect-[9/16]",
    }));
  };

  if (isPending)
    return (
      <div className="p-4">
        <Loader />
      </div>
    );
  if (error)
    return <div className="p-4 text-red-500">Error: {error.message}</div>;
  if (!property) return <div className="p-4">Property not found</div>;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-2 sm:p-4 pb-13 z-50 w-full bg-black/40 backdrop-blur-sm overflow-y-auto touch-pan-y">
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg max-h-[200%] my-auto transition-all duration-500">
        <div className="flex justify-between items-center border-b p-4 sm:p-6 ">
          <h2 className="text-lg sm:text-xl font-bold">View Property</h2>
          <button
            className="text-gray-500 hover:text-gray-700 text-xl"
            onClick={() => navigate(-1)}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="p-4 sm:p-8 space-y-6">
          <Carousel
            plugins={[plugin.current]}
            className="w-full"
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
            <span >
              <CarouselPrevious className="hidden md:block " />
            </span>
            <span>
              <CarouselNext className="hidden md:block" />
            </span>
          </Carousel>

          <div>
            <p className="text-sm sm:text-base leading-relaxed text-gray-700">
              {property.description}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {PropertyList.filter((item) => {
              const value = getNestedProperty(property, item.key);
              if (item.key.startsWith("features.")) return value === true;
              return value != null && value !== "";
            }).map((item) => {
              const value = getNestedProperty(property, item.key);
              return (
                <div
                  className="flex items-center gap-2 bg-gray-100 rounded-lg p-3 text-sm sm:text-base"
                  key={item.key}
                >
                  <item.icon className="text-gray-600" />
                  <span className="font-medium text-gray-800">
                    {item.label}:{" "}
                    {value != null && value !== ""
                      ? typeof value === "number"
                        ? value.toLocaleString()
                        : typeof value === "boolean"
                        ? value
                          ? "Yes"
                          : "No"
                        : String(value)
                      : "N/A"}
                  </span>
                </div>
              );
            })}
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3">
              Documents
            </h3>
            {property.documents && property.documents.length > 0 ? (
              <div className="flex flex-col gap-2">
                {property.documents.map((document, index) => (
                  <div
                    className="flex items-center gap-3 bg-gray-100 p-2 sm:p-3 rounded-lg text-xs sm:text-sm overflow-hidden"
                    key={index}
                  >
                    <FaRegClipboard
                      className="cursor-pointer text-gray-600 hover:text-gray-800 flex-shrink-0"
                      onClick={() => {
                        navigator.clipboard.writeText(document);
                        toast.success("Document URL copied to clipboard");
                      }}
                      aria-label="Copy document URL"
                    />
                    <span className="truncate text-gray-700">{document}</span>
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-gray-500 text-sm">
                No documents available
              </span>
            )}
          </div>

          <div className="flex justify-end">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewProperty;
