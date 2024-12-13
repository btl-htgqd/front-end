'use client'; // Đảm bảo rằng component này chạy trên client
import { useState, useEffect } from 'react';

const SearchComponent: React.FC = () => {
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    return (
        <div className="flex-1 flex justify-center mx-4">
            <form
                id="_77_fm"
                className="flex w-full max-w-full"
                encType="multipart/form-data"
            >
                <input
                    className="border border-gray-400 p-2 rounded-l-md w-full"
                    id="_77_keywords"
                    type="text"
                    name="_77_keywords"
                    placeholder="Nhập từ khóa để tìm kiếm ..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
                <input
                    id="_77_image_upload"
                    type="file"
                    name="_77_image_upload"
                    accept="image/*"
                    className="hidden"
                />
                <label
                    htmlFor="_77_image_upload"
                    className="ml-2 p-2 bg-gray-200 border border-gray-400 rounded-md cursor-pointer"
                >
                    <i className="fa fa-image"></i>
                </label>
                <button type="submit" className="bg-[#38CB89] text-white p-2 rounded-r-md ml-2">
                    <i className="fa fa-search"></i>
                </button>
            </form>
            {loading && <p>Đang tải hình ảnh...</p>}
            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
};

export default SearchComponent;
