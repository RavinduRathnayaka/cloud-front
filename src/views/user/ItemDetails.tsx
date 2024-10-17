import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const ItemDetails = () => {
    const { id } = useParams<{ id: string }>();
    console.log(id);
    const [item, setItem] = useState<any>(null); // Define state for the item
    const navigate = useNavigate();

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const response = await axios.get(`https://backeee.onrender.com/api/auth/items/${id}`); // Adjust the API endpoint accordingly
                setItem(response.data);
                console.log(response); // Log response data
            } catch (error) {
                console.error("Failed to fetch item:", error);
            }
        };

        fetchItem();
    }, [id]);

    if (!item) {
        return <div>Item not found</div>; // Loading state
    }

    const handleBuyNow = () => {
        navigate(`/checkout`, { state: { item } });
    };

    return (
        <div className="overflow-hidden bg-white pb-11 font-poppins mx-auto">
            <div>
                <section className="text-gray-700 body-font overflow-hidden bg-white">
                    <div className="container px-5 py-14 mx-auto">
                        <div className="lg:w-4/5 mx-auto flex gap-10 rounded-xl flex-wrap justify-center">
                            <img alt="ecommerce" className="lg:w-5/12 w-full h-fit rounded-2xl border border-gray-200"
                                src={`/images/${item.image}`}  />
                            <div className="lg:w-1/2 w-full p-10 lg:mt-0 rounded-xl bg-gray-100">
                                <h1 className="text-grey text-3xl title-font font-medium mb-6">{item.name}</h1>
                                <p className="leading-relaxed mb-10 text-grey">{item.description}.</p>
                                <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-200 mb-5">
                                    {/* Your quantity selector here */}
                                </div>
                                <div className="grid">
                                    {/* Convert price from string to number before formatting */}
                                    <span className="title-font font-bold text-2xl text-grey mb-10">
                                        ${Number(item.price).toFixed(2)}
                                    </span>
                                    <button
                                        onClick={handleBuyNow}
                                        type="button"
                                        className="group inline-flex w-full items-center justify-center rounded-lg bg-primary px-6 py-4 text-lg font-semibold text-white transition-all duration-200 ease-in-out focus:shadow hover:bg-grey"
                                    >
                                        Buy Now
                                        <svg xmlns="http://www.w3.org/2000/svg" className="group-hover:ml-8 ml-4 h-6 w-6 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};
