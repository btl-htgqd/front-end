import React from "react";

interface Tour {
    id: number;
    url: string;
    name: string;
    price: number;
    ratingValue: number;
    ratingCount: number;
    region: string;
    duration: string;
    departures: string[];
}

const TourDetail: React.FC<{ tour: Tour }> = ({ tour }) => {
    return (
        <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-bold mb-4">{tour.name}</h2>

            {/* Hiển thị khu vực */}
            <div className="mb-4">
                <span className="font-medium">Khu vực:</span> {tour.region}
            </div>

            {/* Hiển thị giá */}
            <div className="mb-4">
                <span className="font-medium">Giá:</span> {tour.price.toLocaleString()} VND
            </div>

            {/* Hiển thị đánh giá */}
            <div className="mb-4">
                <span className="font-medium">Đánh giá:</span> {tour.ratingValue} (
                {tour.ratingCount} đánh giá)
            </div>

            {/* Hiển thị thời gian */}
            <div className="mb-4">
                <span className="font-medium">Thời gian:</span> {tour.duration}
            </div>

            {/* Hiển thị các ngày khởi hành */}
            <div className="mb-4">
                <span className="font-medium">Ngày khởi hành:</span>
                {tour.departures.map((departure, index) => (
                    <span key={index} className="ml-2">
            {new Date(departure).toLocaleDateString()}
          </span>
                ))}
            </div>

            {/* Liên kết đến trang chi tiết tour */}
            <a
                href={tour.url}
                className="text-blue-500 hover:text-blue-700"
                target="_blank"
                rel="noopener noreferrer"
            >
                Xem chi tiết tour
            </a>
        </div>
    );
};

export default TourDetail;
