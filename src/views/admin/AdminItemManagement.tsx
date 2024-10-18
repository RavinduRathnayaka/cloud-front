import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import axios from 'axios';

interface Item {
  _id: string; // Use _id instead of id
  name: string;
  image: string;
  price: string;
  quantity: number; // Keep quantity field
}

const AdminItemManagement: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState<Item>({
    _id: '', // Change from id to _id
    name: '',
    image: '',
    price: '',
    quantity: 0, // Initialize quantity
  });

  // Fetch the items from the database
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('https://cloud-back-7qc4.onrender.com/api/auth/items'); // Adjust the endpoint URL as per your backend
        setItems(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Failed to fetch items:', error);
      }
    };
    fetchItems();
  }, []);

  // Open the modal for adding or editing an item
  const handleAdd = () => {
    setIsEditing(false);
    setCurrentItem({ _id: '', name: '', image: '', price: '', quantity: 0 });
    setShowModal(true);
  };

  const handleEdit = (item: Item) => {
    setIsEditing(true);
    setCurrentItem(item);
    setShowModal(true);
  };

  // Delete an item
  const handleDelete = async (_id: string) => { // Change id to _id
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`https://cloud-back-7qc4.onrender.com/api/auth/items/${_id}`); // Adjust the endpoint URL
        setItems(items.filter(item => item._id !== _id)); // Change id to _id
        alert('Item deleted successfully');
      } catch (error) {
        console.error('Failed to delete item:', error);
      }
    }
  };

  // Handle form submit for adding/updating item
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing) {
      if (!currentItem._id) { // Change id to _id
        console.error('Item ID is missing for update.');
        return; // Prevents the PUT request if ID is not available
      }
      // Update the item
      try {
        await axios.put(`https://cloud-back-7qc4.onrender.com/api/auth/items/${currentItem._id}`, currentItem); // Change id to _id
        setItems(items.map(item => item._id === currentItem._id ? currentItem : item)); // Change id to _id
        alert('Item updated successfully');
      } catch (error) {
        console.error('Failed to update item:', error);
      }
    } else {
      // Add a new item
      try {
        const response = await axios.post('https://cloud-back-7qc4.onrender.com/api/auth/items', currentItem);
        setItems([...items, response.data]);
        alert('Item added successfully!');
      } catch (error) {
        console.error('Failed to add item:', error);
      }
    }
    setShowModal(false);
  };

  // Filter items based on the search query
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-screen-xl mx-auto p-4 mt-10">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Manage Items ({items.length})</h1>
        <input
          type="text"
          placeholder="Search by name..."
          className="border px-3 py-2 rounded mb-4 w-full max-w-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleAdd}
        >
          Add Item
        </button>
      </div>

      {/* Table for displaying items */}
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-4 px-4 border-b">Name</th>
            <th className="py-4 px-4 border-b">Image</th>
            <th className="py-4 px-4 border-b">Price</th>
            <th className="py-4 px-4 border-b">Quantity</th> {/* Add Quantity column */}
            <th className="py-4 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((item) => (
            <tr key={item._id}> {/* Use _id as the key */}
              <td className="py-4 px-4 border-b flex justify-center items-center">{item.name}</td>
              <td className="py-4 px-4 border-b">
                <img 
                  src={`/images/${item.image}`} 
                  alt={item.name} 
                  className="w-auto h-6 mx-auto object-cover" 
                />
              </td>
              <td className="py-2 px-4 border-b text-center">${item.price}</td>
              <td className="py-2 px-4 border-b text-center">{item.quantity}</td> {/* Display Quantity */}
              <td className="py-2 px-4 border-b flex justify-center items-center">
                <button
                  className="bg-blue-500 text-white px-4 py-2 mr-2 rounded"
                  onClick={() => handleEdit(item)}
                >
                  Update
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={() => handleDelete(item._id)} // Use _id
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Add/Update Item */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/2">
            <h2 className="text-xl font-bold mb-4">{isEditing ? 'Update' : 'Add'} Item</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded"
                  value={currentItem.name}
                  onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Image URL</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded"
                  value={currentItem.image}
                  onChange={(e) => setCurrentItem({ ...currentItem, image: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Price</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded"
                  value={currentItem.price}
                  onChange={(e) => setCurrentItem({ ...currentItem, price: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Quantity</label> {/* Add Quantity field */}
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded"
                  value={currentItem.quantity}
                  onChange={(e) => setCurrentItem({ ...currentItem, quantity: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  {isEditing ? 'Update' : 'Add'} Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Back Button Below the Table */}
      <div className="flex justify-center mt-4">
        <Link to="/admindashboard" className="bg-blue-500 text-white px-4 py-2 rounded">
          Back to Admin Dashboard
        </Link>
      </div>
    </div>
  );
};

export default AdminItemManagement;
