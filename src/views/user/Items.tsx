import { SetStateAction, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

// Define the Item interface
interface Item {
    _id: number;
    name: string;
    image: string;
    price: number;
    ratings: number;
}

export const Items = () => {
    const [items, setItems] = useState<Item[]>([]); // Use the Item interface for state
    const [searchTerm, setSearchTerm] = useState('');
    const [priceFilter, setPriceFilter] = useState('');
    const [ratingFilter, setRatingFilter] = useState('');
    const [sortOrder, setSortOrder] = useState('A-Z');

    const handleSearchChange = (e: { target: { value: SetStateAction<string>; }; }) => {
        setSearchTerm(e.target.value);
    };

    const handlePriceChange = (e: { target: { value: SetStateAction<string>; }; }) => {
        setPriceFilter(e.target.value);
    };

    const handleRatingChange = (e: { target: { value: SetStateAction<string>; }; }) => {
        setRatingFilter(e.target.value);
    };

    const handleSortChange = (e: { target: { value: SetStateAction<string>; }; }) => {
        setSortOrder(e.target.value);
    };

    useEffect(() => {
        // Fetch items from the API using Axios
        const fetchItems = async () => {
            try {
                const response = await axios.get<Item[]>('https://cloud-back-7qc4.onrender.com/api/auth/items'); // Use the Item type for the response
                console.log(response.data); // Log the fetched items to check the structure
                setItems(response.data); // Assuming the data is an array of items
            } catch (error) {
                console.error(error);
            }
        };

        fetchItems();
    }, []);

    const filteredItems = items
        .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter(item => {
            if (priceFilter === '') return true;
            const [minPrice, maxPrice] = priceFilter.split(' - ').map(Number);
            return item.price >= (minPrice || 0) && item.price <= (maxPrice || Infinity);
        })
        .filter(item => {
            if (ratingFilter === '') return true;
            const [minRating, maxRating] = ratingFilter.split(' - ').map(Number);
            return item.ratings >= (minRating || 0) && item.ratings <= (maxRating || Infinity);
        })
        .sort((a, b) => {
            if (sortOrder === 'A-Z') return a.name.localeCompare(b.name);
            if (sortOrder === 'Z-A') return b.name.localeCompare(a.name);
            return 0;
        });

    return (
        <div>
            {/* Filter Bar */}
            <div className="flex flex-col bg-gray-100 w-fit sm:flex-row items-center gap-6 p-4 mt-10 mx-auto justify-center rounded-xl shadow-md">
                <p>Filter Items</p>
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="border rounded p-2"
                />

                <select
                    value={priceFilter}
                    onChange={handlePriceChange}
                    className="border rounded p-2"
                >
                    <option value="">All</option>
                    <option value="0 - 5">Below $5</option>
                    <option value="5 - 10">$5 - $10</option>
                    <option value="10 - 20">$10 - $20</option>
                    <option value="20 - 30">$20 - $30</option>
                    <option value="30 - 50">Above $30</option>
                </select>

                <select
                    value={ratingFilter}
                    onChange={handleRatingChange}
                    className="border rounded p-2"
                >
                    <option value="">All</option>
                    <option value="0 - 1">Below 1</option>
                    <option value="1 - 2">1 - 2</option>
                    <option value="2 - 3">2 - 3</option>
                    <option value="3 - 4">3 - 4</option>
                    <option value="4 - 5">4 - 5</option>
                </select>

                <select
                    value={sortOrder}
                    onChange={handleSortChange}
                    className="border rounded p-2"
                >
                    <option value="A-Z">Name A - Z</option>
                    <option value="Z-A">Name Z - A</option>
                </select>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 p-8 max-w-screen-xl mx-auto">
                  {filteredItems.map(item => (
          <Link key={item._id} to={`/item/${item._id}`}>
              <div className="bg-white shadow-lg rounded-lg overflow-hidden transform transition duration-500 hover:scale-105">
                  <img
                      src={`/images/${item.image}`} 
                      alt={item.name}
                      className="w-full h-full w-48 object-cover"
                  />
                  <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                      <p className="text-white px-2 bg-primary w-fit rounded-xl mt-2">${Number(item.price).toFixed(2)}</p>
                  </div>
              </div>
          </Link>
      ))}

            </div>
        </div>
    );
};
