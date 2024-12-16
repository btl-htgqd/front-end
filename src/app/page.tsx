'use client'
import React, { useState } from "react";
import axios from "axios";
import Banner from "@/components/Banner";

const Home: React.FC = () => {
    const [priceStart, setPriceStart] = useState<number>(0);
    const [priceEnd, setPriceEnd] = useState<number>(10000000);
    const [timeStart, setTimeStart] = useState<string>("2024-01-01");
    const [timeEnd, setTimeEnd] = useState<string>("2024-12-13");
    const [region, setRegion] = useState<string>("Du lịch Trong Nước");
    const [selectedRegion, setSelectedRegion] = useState<'Bắc' | 'Trung' | 'Nam' | "">("");
    const [selectedProvince, setSelectedProvince] = useState<string>("");
    const [tours, setTours] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState<string | null>(null);

    const handleStartProcess = async () => {
        setLoading(true);
        setError(null);
        setData(null);  // Đảm bảo dữ liệu cũ được xóa trước khi bắt đầu quá trình mới

        try {
            // API 1: Lấy toàn bộ dữ liệu
            const dataNormalResponse = await axios.get(
                `http://localhost:3001/api/calculation/data-normal?priceStart=${priceStart}&priceEnd=${priceEnd}&timeStart=${timeStart}&timeEnd=${timeEnd}&region=${encodeURIComponent(region)}/${encodeURIComponent(selectedRegion || '')}/${encodeURIComponent(selectedProvince || '')}`
            );
            const allData = dataNormalResponse.data;
            const limitedData = allData.slice(0, 20); // Lấy 200 dữ liệu
            const normalizeData = limitedData.map(item => item); // Lấy phần weighted

            console.log('Step 1 Result (Limited to 200 items):', limitedData);

            // API 2: Lấy phần `weighted` (Chỉ lấy phần weighted)
            const weighteDataResponse = await axios.post('http://localhost:3001/api/calculation/weighted-data', limitedData);
            const weightedData = weighteDataResponse.data.map(item => item); // Lấy phần weighted
            console.log('Step 2 Result (Weighted only):', weightedData);

            // API 3: Lấy toàn bộ dữ liệu giải pháp
            const solutionResponse = await axios.post('http://localhost:3001/api/calculation/solution', weighteDataResponse.data);
            console.log('Step 3 Result (Solution):', solutionResponse.data);

            // API 4: Lấy 2 phần "distancePositive" và "distanceNegative"
            const distanceData = {
                weightedNormalizedData: weighteDataResponse.data,
                idealSolution: solutionResponse.data.idealSolution,
                negativeIdealSolution: solutionResponse.data.negativeIdealSolution,
            };
            const distanceResponse = await axios.post('http://localhost:3001/api/calculation/distance', distanceData);
            const distanceValues = distanceResponse.data.map(item => item);
            console.log('Step 4 Result (Distance Positive & Negative):', distanceValues);

            // API 5: Lấy phần "score"
            const rankingResponse = await axios.post('http://localhost:3001/api/calculation/ranking', distanceResponse.data);
            const score = rankingResponse.data.map(item => item);
            console.log('Step 5 Result (Score):', score);

            // API 6: Lấy toàn bộ dữ liệu topsis
            const topsisResponse = await axios.get(`http://localhost:3001/api/calculation/topsis?priceStart=${priceStart}&priceEnd=${priceEnd}&timeStart=${timeStart}&timeEnd=${timeEnd}&region=${encodeURIComponent(region)}&area=${encodeURIComponent(selectedRegion)}&province=${encodeURIComponent(selectedProvince)}`);
            console.log('Step 6 Result (Topsis):', topsisResponse.data);
            const limitedDataTopsis = topsisResponse.data.slice(0, 10); // Lấy 200 dữ liệu
            // Set dữ liệu cần hiển thị
            setData({
                solutionResponse: solutionResponse.data,
                normalize: normalizeData,
                topsis: limitedDataTopsis,
                weightedData: weightedData,
                distanceValues: distanceValues,
                scores: score,
            });
        } catch (err) {
            setError('An error occurred during the process.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };


    const handleSearch = async () => {
        setLoading(true);
        const url = `http://localhost:3001/api/tour/search?priceStart=${priceStart}&priceEnd=${priceEnd}&timeStart=${timeStart}&timeEnd=${timeEnd}&region=${encodeURIComponent(region)}/${encodeURIComponent(selectedRegion || '')}/${encodeURIComponent(selectedProvince || '')}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            setTours(data);
        } catch (error) {
            console.error('Error fetching tours:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedRegion = e.target.value as 'Bắc' | 'Trung' | 'Nam' | '';
        setSelectedRegion(selectedRegion);
        setRegion(e.target.value);

        if (e.target.value === "Du lịch Trong Nước") {
            setPriceStart(1000000);
            setPriceEnd(10000000 + 1000000);
        } else if (e.target.value === "Du lịch Ngoài Nước") {
            setPriceStart(10000000);
            setPriceEnd(10000000 + 10000000);
        }
    };


    // Hàm xử lý khi người dùng nhấn nút tìm kiếm
    const provinces = {
        "Du lịch miền Bắc": [
            "Bắc Giang", "Bắc Kạn", "Bắc Ninh", "Cao Bằng", "Điện Biên", "Hà Giang",
            "Hà Nam", "Hà Nội", "Hải Dương", "Hải Phòng", "Hòa Bình", "Hưng Yên",
            "Lai Châu", "Lạng Sơn", "Lào Cai", "Nam Định", "Nghệ An", "Ninh Bình",
            "Phú Thọ", "Quảng Ninh", "Sơn La", "Thái Bình", "Thái Nguyên", "Tuyên Quang",
            "Vĩnh Phúc", "Yên Bái"
        ],
        "Du lịch miền Trung": [
            "Bình Định", "Bình Thuận", "Đà Nẵng", "Đắk Lắk", "Đắk Nông", "Gia Lai",
            "Hà Tĩnh", "Khánh Hòa", "Kon Tum", "Lâm Đồng", "Nghệ An", "Ninh Thuận",
            "Phú Yên", "Quảng Bình", "Quảng Nam", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị",
            "Thanh Hóa", "Thừa Thiên Huế"
        ],
        "Du lịch miền Nam": [
            "An Giang", "Bà Rịa Vũng Tàu", "Bạc Liêu", "Bến Tre", "Bình Dương", "Bình Phước",
            "Bình Thuận", "Cà Mau", "Cần Thơ", "Đồng Nai", "Đồng Tháp", "Hậu Giang",
            "Hồ Chí Minh", "Kiên Giang", "Long An", "Nam Định", "Ninh Bình", "Phú Yên",
            "Sóc Trăng", "Sơn La", "Tây Ninh", "Tiền Giang", "Trà Vinh", "Vĩnh Long"
        ]
    };
    return (
        <div className="mx-auto">
            <Banner />
            <div className="mt-6 mx-auto max-w-[80%] ">

                <h1 className="text-2xl font-bold mb-6">Khó khăn khi chọn tour? Hãy để chúng tôi giúp</h1>

                {/* Form nhập thông tin */}
                <div className="space-y-4">
                    {/* Khoảng giá */}
                    <div>
                        <label className="block font-medium mb-2">Khoảng giá</label>
                        <div className="flex space-x-4">
                            <input
                                type="number"
                                value={priceStart}
                                onChange={(e) => setPriceStart(Number(e.target.value))}
                                className="border p-2 rounded"
                                placeholder="Giá bắt đầu"
                            />
                            <input
                                type="number"
                                value={priceEnd}
                                onChange={(e) => setPriceEnd(Number(e.target.value))}
                                className="border p-2 rounded"
                                placeholder="Giá kết thúc"
                            />
                        </div>
                    </div>

                    {/* Thời gian */}
                    <div>
                        <label className="block font-medium mb-2">Khoảng thời gian</label>
                        <div className="flex space-x-4">
                            <input
                                type="date"
                                value={timeStart}
                                onChange={(e) => setTimeStart(e.target.value)}
                                className="border p-2 rounded"
                            />
                            <input
                                type="date"
                                value={timeEnd}
                                onChange={(e) => setTimeEnd(e.target.value)}
                                className="border p-2 rounded"
                            />
                        </div>
                    </div>

                    {/* Khu vực */}
                    {/* Khu vực: Trong nước hoặc ngoài nước */}
                    <div>
                        <label className="block font-medium mb-2">Khu vực</label>
                        <select
                            value={region}
                            onChange={(e) => {
                                setRegion(e.target.value);
                                if (e.target.value === "Du lịch Trong Nước") {
                                    setSelectedRegion("");
                                    setSelectedProvince(""); // Reset tỉnh khi đổi khu vực
                                }
                            }}
                            className="border p-2 rounded w-full"
                        >
                            <option value="Du lịch Trong Nước">Du lịch Trong Nước</option>
                            <option value="Du lịch Nước Ngoài">Du lịch Nước Ngoài</option>
                        </select>
                    </div>

                    {/* Nếu chọn "Trong Nước" thì hiển thị thêm các lựa chọn miền */}
                    {region === "Du lịch Trong Nước" && (
                        <>
                            <div>
                                <label className="block font-medium mb-2">Miền</label>
                                <select
                                    value={selectedRegion}
                                    onChange={(e) => {
                                        setSelectedRegion(e.target.value);
                                        setSelectedProvince(""); // Reset tỉnh khi đổi miền
                                    }}
                                    className="w-full border p-2 rounded-lg"
                                >
                                    <option value="">Chọn miền</option>
                                    <option value="Du lịch miền Bắc">Bắc</option>
                                    <option value="Du lịch miền Trung">Trung</option>
                                    <option value="Du lịch miền Nam">Nam</option>
                                </select>
                            </div>
                            
                        </>
                    )}

                    {/* Nút tìm kiếm */}
                    <div>
                        <button
                            onClick={async () => {
                                await handleStartProcess(); // Gọi handleStartProcess ngay sau đó nếu cần
                                await handleSearch();
                            }}
                            className="bg-[#38CB89] text-white p-3 rounded w-full"
                            disabled={loading}
                        >
                            {loading ? "Đang tìm kiếm..." : "Tìm kiếm"}
                        </button>

                        {error && <p style={{ color: 'red' }}>{error}</p>}

                        {data && (
                            <div>
                                {/* Hiển thị chỉ phần weightedData */}
                                <h3 className="text-2xl font-bold">Bước 1 (Normalize):</h3>
                                <div className="mt-8">
                                    {loading ? (
                                        <p>Đang tải...</p>
                                    ) : !data?.normalize || data.normalize.length === 0 ? (
                                        <p>Không tìm thấy tour nào!</p>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {data.normalize.map((item, index) => (
                                                <div
                                                    key={item.id || index}
                                                    className="border p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                                                >
                                                    <h3 className="font-semibold text-lg text-gray-800">
                                                        {item.name || 'Tên không xác định'}
                                                    </h3>
                                                    <p className="text-gray-600">
                                                        {item.region || 'Khu vực không xác định'}
                                                    </p>
                                                    <p className="text-gray-600">
                                                        {item.duration || 'Thời gian không xác định'}
                                                    </p>
                                                    <p className="text-gray-600">
                                                        {item.price
                                                            ? `${item.price.toLocaleString()} VND`
                                                            : 'Giá không xác định'}
                                                    </p>
                                                    <p className="text-gray-600">
                                                        Khởi hành:{" "}
                                                        {item.notDeparture === null
                                                            ? item.departures?.length > 0
                                                                ? item.departures.map((departure, index) => (
                                                                    <span key={index}>
                    {new Date(departure).toLocaleDateString('vi-VN')}
                                                                        {index < item.departures.length - 1 && ', '}
                </span>
                                                                ))
                                                                : 'Không có thông tin'
                                                            : item.notDeparture === 'Liên hệ'
                                                                ? 'Liên hệ'
                                                                : 'Không có thông tin'}
                                                    </p>

                                                    <p className="text-gray-600">
                                                        Normalized Price:{" "}
                                                        {item.normalized?.price
                                                            ? `${item.normalized.price.toFixed(2)}`
                                                            : 'Không có thông tin'}
                                                    </p>
                                                    <p className="text-gray-600">
                                                        Normalized Rating Value:{" "}
                                                        {item.normalized?.ratingValue
                                                            ? `${item.normalized.ratingValue.toFixed(2)}`
                                                            : 'Không có thông tin'}
                                                    </p>
                                                    <p className="text-gray-600">
                                                        Normalized Rating Count:{" "}
                                                        {item.normalized?.ratingCount
                                                            ? `${item.normalized.ratingCount.toFixed(2)}`
                                                            : 'Không có thông tin'}
                                                    </p>
                                                    <a
                                                        href={item.url || '#'}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-500 hover:underline"
                                                    >
                                                        Xem chi tiết
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <h3 className="text-2xl font-bold">Bước 2 (Weighted):</h3>
                                {/* Hiển thị chỉ phần weightedData */}
                                <div className="mt-8">
                                    {loading ? (
                                        <p>Đang tải...</p>
                                    ) : !data?.weightedData || data.weightedData.length === 0 ? (
                                        <p>Không tìm thấy tour nào!</p>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {data.weightedData.map((item, index) => (
                                                <div
                                                    key={item.id || index}
                                                    className="border p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                                                >
                                                    <h3 className="font-semibold text-lg text-gray-800">
                                                        {item.name || 'Tên không xác định'}
                                                    </h3>
                                                    <p className="text-gray-600">
                                                        {item.region || 'Khu vực không xác định'}
                                                    </p>
                                                    <p className="text-gray-600">
                                                        {item.duration || 'Thời gian không xác định'}
                                                    </p>
                                                    <p className="text-gray-600">
                                                        {item.price
                                                            ? `${item.price.toLocaleString()} VND`
                                                            : 'Giá không xác định'}
                                                    </p>
                                                    <p className="text-gray-600">
                                                        Khởi hành:{" "}
                                                        {item.notDeparture === null
                                                            ? item.departures?.length > 0
                                                                ? item.departures.map((departure, index) => (
                                                                    <span key={index}>
                    {new Date(departure).toLocaleDateString('vi-VN')}
                                                                        {index < item.departures.length - 1 && ', '}
                </span>
                                                                ))
                                                                : 'Không có thông tin'
                                                            : item.notDeparture === 'Liên hệ'
                                                                ? 'Liên hệ'
                                                                : 'Không có thông tin'}
                                                    </p>

                                                    <p className="text-gray-600">
                                                        Weighted Price:{" "}
                                                        {item.weighted?.price
                                                            ? `${item.weighted.price.toFixed(2)}`
                                                            : 'Không có thông tin'}
                                                    </p>
                                                    <p className="text-gray-600">
                                                        Weighted Rating Value:{" "}
                                                        {item.weighted?.ratingValue
                                                            ? `${item.weighted.ratingValue.toFixed(2)}`
                                                            : 'Không có thông tin'}
                                                    </p>
                                                    <p className="text-gray-600">
                                                        Weighted Rating Count:{" "}
                                                        {item.weighted?.ratingCount
                                                            ? `${item.weighted.ratingCount.toFixed(2)}`
                                                            : 'Không có thông tin'}
                                                    </p>

                                                    <a
                                                        href={item.url || '#'}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-500 hover:underline"
                                                    >
                                                        Xem chi tiết
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <h3 className="text-2xl font-bold">Bước 3:</h3>
                                {/* Hiển thị chỉ phần weightedData */}
                                <pre>{JSON.stringify(data.solutionResponse, null, 2)}</pre>

                                <h3 className="text-2xl font-bold">Bước 4 (Distance Positive & Negative):</h3>
                                {/* Hiển thị chỉ phần distancePositive và distanceNegative */}
                                <div className="mt-8">
                                    {loading ? (
                                        <p>Đang tải...</p>
                                    ) : !data?.distanceValues || data.distanceValues.length === 0 ? (
                                        <p>Không tìm thấy tour nào!</p>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {data.distanceValues.map((item, index) => (
                                                <div
                                                    key={item.id || index}
                                                    className="border p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                                                >
                                                    <h3 className="font-semibold text-lg text-gray-800">
                                                        {item.name || 'Tên không xác định'}
                                                    </h3>
                                                    <p className="text-gray-600">
                                                        {item.region || 'Khu vực không xác định'}
                                                    </p>
                                                    <p className="text-gray-600">
                                                        {item.duration || 'Thời gian không xác định'}
                                                    </p>
                                                    <p className="text-gray-600">
                                                        {item.price
                                                            ? `${item.price.toLocaleString()} VND`
                                                            : 'Giá không xác định'}
                                                    </p>
                                                    <p className="text-gray-600">
                                                        Khởi hành:{" "}
                                                        {item.notDeparture === null
                                                            ? item.departures?.length > 0
                                                                ? item.departures.map((departure, index) => (
                                                                    <span key={index}>
                    {new Date(departure).toLocaleDateString('vi-VN')}
                                                                        {index < item.departures.length - 1 && ', '}
                </span>
                                                                ))
                                                                : 'Không có thông tin'
                                                            : item.notDeparture === 'Liên hệ'
                                                                ? 'Liên hệ'
                                                                : 'Không có thông tin'}
                                                    </p>

                                                    <p className="text-gray-600">
                                                        Distance Positive:{" "}
                                                        {item.distancePositive
                                                            ? `${item.distancePositive.toFixed(2)}`
                                                            : 'Không có thông tin'}
                                                    </p>
                                                    <p className="text-gray-600">
                                                        Distance Negative:{" "}
                                                        {item.distanceNegative
                                                            ? `${item.distanceNegative.toFixed(2)}`
                                                            : 'Không có thông tin'}
                                                    </p>


                                                    <a
                                                        href={item.url || '#'}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-500 hover:underline"
                                                    >
                                                        Xem chi tiết
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <h3 className="text-2xl font-bold">Bước 5 (Score):</h3>
                                {/* Hiển thị chỉ phần score */}
                                <div className="mt-8">
                                    {loading ? (
                                        <p>Đang tải...</p>
                                    ) : !data?.scores || data.scores.length === 0 ? (
                                        <p>Không tìm thấy tour nào!</p>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {data.scores.map((item, index) => (
                                                <div
                                                    key={item.id || index}
                                                    className="border p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                                                >
                                                    <h3 className="font-semibold text-lg text-gray-800">
                                                        {item.name || 'Tên không xác định'}
                                                    </h3>
                                                    <p className="text-gray-600">
                                                        {item.region || 'Khu vực không xác định'}
                                                    </p>
                                                    <p className="text-gray-600">
                                                        {item.duration || 'Thời gian không xác định'}
                                                    </p>
                                                    <p className="text-gray-600">
                                                        {item.price
                                                            ? `${item.price.toLocaleString()} VND`
                                                            : 'Giá không xác định'}
                                                    </p>
                                                    <p className="text-gray-600">
                                                        Khởi hành:{" "}
                                                        {item.notDeparture === null
                                                            ? item.departures?.length > 0
                                                                ? item.departures.map((departure, index) => (
                                                                    <span key={index}>
                    {new Date(departure).toLocaleDateString('vi-VN')}
                                                                        {index < item.departures.length - 1 && ', '}
                </span>
                                                                ))
                                                                : 'Không có thông tin'
                                                            : item.notDeparture === 'Liên hệ'
                                                                ? 'Liên hệ'
                                                                : 'Không có thông tin'}
                                                    </p>

                                                    <p className="text-gray-600">
                                                        Score :{" "}
                                                        {item.score
                                                            ? `${item.score.toFixed(2)}`
                                                            : 'Không có thông tin'}
                                                    </p>


                                                    <a
                                                        href={item.url || '#'}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-500 hover:underline"
                                                    >
                                                        Xem chi tiết
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Kết quả tìm kiếm */}
                <div className="mt-8">
                    <h2 className="text-xl font-bold mb-4">Kết quả Tour</h2>

                    {loading ? (
                        <p>Đang tải...</p>
                    ) : tours.length === 0 ? (
                        <p>Không tìm thấy tour nào!</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {tours.map((tour) => (
                                <div key={tour.id} className="border p-4 rounded-lg shadow-md">
                                    <h3 className="font-semibold text-lg">{tour.name}</h3>
                                    <p>{tour.region}</p>
                                    <p>{tour.duration}</p>
                                    <p>{tour.price.toLocaleString()} VND</p>
                                    <a href={tour.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">Xem chi tiết</a>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
