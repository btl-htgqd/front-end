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

        try {
            const dataNormalResponse = await axios.get(`http://localhost:3001/api/calculation/data-normal?priceStart=${priceStart}&priceEnd=${priceEnd}&timeStart=${timeStart}&timeEnd=${timeEnd}&region=${encodeURIComponent(region)}`);
            console.log('Step 1 Result:', dataNormalResponse.data);

            const weighteDataResponse = await axios.get('http://localhost:3001/api/calculation/weighted-data', dataNormalResponse.data);
            console.log('Step 2 Result:', weighteDataResponse.data);

            const solutionResponse = await axios.get('http://localhost:3001/api/calculation/solution', weighteDataResponse.data);
            console.log('Step 3 Result:', solutionResponse.data);

            const distanceResponse = await axios.get('http://localhost:3001/api/calculation/distance', {
                weightedNormalizedData: weighteDataResponse.data,
                idealSolution: solutionResponse.data.idealSolution,
                negativeIdealSolution: solutionResponse.data.negativeIdealSolution,
            });
            console.log('Step 4 Result:', distanceResponse.data);

            const rankingResponse = await axios.get('http://localhost:3001/api/calculation/ranking', distanceResponse.data);
            console.log('Step 5 Result:', rankingResponse.data);

            const topsisResponse = await axios.get(`http://localhost:3001/api/calculation/topsis?priceStart=${priceStart}&priceEnd=${priceEnd}&timeStart=${timeStart}&timeEnd=${timeEnd}&region=${encodeURIComponent(region)}`);

            console.log('Step 6 Result:', topsisResponse.data);

            setData(topsisResponse.data);
        } catch (err) {
            setError('An error occurred during the process.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        setLoading(true);
        const url = `http://localhost:3001/api/tour/search?priceStart=${priceStart}&priceEnd=${priceEnd}&timeStart=${timeStart}&timeEnd=${timeEnd}&region=${encodeURIComponent(region)}`;

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
        Bắc: [
            "Bắc Giang", "Bắc Kạn", "Bắc Ninh", "Cao Bằng", "Điện Biên", "Hà Giang",
            "Hà Nam", "Hà Nội", "Hải Dương", "Hải Phòng", "Hòa Bình", "Hưng Yên",
            "Lai Châu", "Lạng Sơn", "Lào Cai", "Nam Định", "Nghệ An", "Ninh Bình",
            "Phú Thọ", "Quảng Ninh", "Sơn La", "Thái Bình", "Thái Nguyên", "Tuyên Quang",
            "Vĩnh Phúc", "Yên Bái"
        ],
        Trung: [
            "Bình Định", "Bình Thuận", "Đà Nẵng", "Đắk Lắk", "Đắk Nông", "Gia Lai",
            "Hà Tĩnh", "Khánh Hòa", "Kon Tum", "Lâm Đồng", "Nghệ An", "Ninh Thuận",
            "Phú Yên", "Quảng Bình", "Quảng Nam", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị",
            "Thanh Hóa", "Thừa Thiên Huế"
        ],
        Nam: [
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
                                }
                            }}
                            className="border p-2 rounded w-full"
                        >
                            <option value="Du lịch Trong Nước">Du lịch Trong Nước</option>
                            <option value="Du lịch Ngoài Nước">Du lịch Nước Ngoài</option>
                        </select>
                    </div>

                    {/* Nếu chọn "Trong Nước" thì hiển thị thêm các lựa chọn miền */}
                    {region === "Du lịch Trong Nước" && (
                        <>
                            <div>
                                <label className="block font-medium mb-2">Miền</label>
                                <select
                                    onChange={handleRegionChange}
                                    className="w-full border p-2 rounded-lg"  // Thêm lớp w-full để làm cho ô chọn rộng hết màn hình
                                >
                                    <option value="">Chọn miền</option>
                                    <option value="Bắc">Bắc</option>
                                    <option value="Trung">Trung</option>
                                    <option value="Nam">Nam</option>
                                </select>
                            </div>


                            {/* Nếu đã chọn miền, hiển thị ô chọn tỉnh */}
                            {selectedRegion && (
                                <div>
                                    <label className="block font-medium mb-2">Tỉnh/Thành phố</label>
                                    <select
                                        value={selectedProvince}
                                        onChange={(e) => setSelectedProvince(e.target.value)}
                                        className="border p-2 rounded w-full"
                                    >
                                        <option value="">Chọn tỉnh</option>
                                        {provinces[selectedRegion].map((province, index) => (
                                            <option key={index} value={province}>
                                                {province}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
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
                        {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
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
