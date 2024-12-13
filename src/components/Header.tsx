'use client';
import React, {useEffect, useState} from 'react';
import SearchComponent from '@/components/SearchBar'
interface UserInfo {
    fullName: string;
    avatar: string | null; // Thay đổi thành null nếu avatar có thể không có
    role: string;

}
const Header: React.FC = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [cartItemCount] = useState(0);
    const [selectedImage] = useState<File | null>(null);
    // const [searchText, setSearchText] = useState("");
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [, setError] = useState<string>('');


    return (
        <header id="banner" className="bg-white">
            <div className="bg-[#38CB89] border-[#38CB89] text-sm w-full flex items-center justify-center">
                <span className="bg-[#38CB89] mt-2 mb-3 px-2 text-[black] text-sm">
                    HUST TRAVEL - Đồng hành cùng bạn trên những chuyến đi
                </span>
            </div>

            <div className="container mx-auto flex items-center justify-between py-2">
                {/* Logo */}
                <div id="banner-left" className="flex-none w-1/6 flex items-center">
                    <a id="logo" href="/" title="Back Home">
                        <img src="/logo.png" alt="Logo của tôi" className="h-16" />
                    </a>
                </div>

                <SearchComponent />

                <div id="banner-right" className="flex-none w-1/5 flex items-center justify-end">

                    <div className="line1 text-right mb-2 relative flex items-center">
                        <div className="line1 text-right mb-2 relative flex items-center" >
                            <img src="/icons/icon1.png" alt="Icon 1" className="h-6 w-6 mr-2 cursor-pointer"/>
                            <button className="text-black">Tài khoản</button>
                            <img src="/icons/icon2.png" alt="Icon 2" className="h-6 w-6 ml-2 cursor-pointer"/>
                        </div>


                        {/* Dropdown menu */}
                        {dropdownOpen && (
                            <div
                                className="absolute top-full mt-1 right-0 w-64 bg-white border border-gray-200 shadow-lg rounded-md z-20">
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Hiển thị hình ảnh đã chọn ở giữa màn hình */}
            {selectedImage && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/6">
                    <img
                        src={URL.createObjectURL(selectedImage)}
                        alt="Selected"
                        className="w-full h-auto object-cover border rounded"
                    />
                </div>
            )}
        </header>
    );
};

export default Header;
