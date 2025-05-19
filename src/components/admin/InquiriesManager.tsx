import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { config } from '../../config';
import { Link } from 'react-router-dom';

interface Inquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  createdAt: string;
  status: 'new' | 'read' | 'responded';
}

const InquiriesManager: React.FC = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}/api/inquiries`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setInquiries(response.data);
    } catch (error) {
      toast.error('Error fetching inquiries');
      console.error('Error fetching inquiries:', error);
    }
  };

  const updateInquiryStatus = async (id: string, status: Inquiry['status']) => {
    try {
      await axios.patch(
        `${config.apiUrl}/api/inquiries/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      toast.success('Inquiry status updated');
      fetchInquiries();
    } catch (error) {
      toast.error('Error updating inquiry status');
      console.error('Error updating inquiry:', error);
    }
  };

  const deleteInquiry = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this inquiry?')) {
      try {
        await axios.delete(`${config.apiUrl}/api/inquiries/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        toast.success('Inquiry deleted successfully');
        fetchInquiries();
      } catch (error) {
        toast.error('Error deleting inquiry');
        console.error('Error deleting inquiry:', error);
      }
    }
  };

  const getStatusColor = (status: Inquiry['status']) => {
    switch (status) {
      case 'new':
        return 'bg-yellow-100 text-yellow-800';
      case 'read':
        return 'bg-blue-100 text-blue-800';
      case 'responded':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Inquiries</h2>
        <div className="flex gap-4">
          <Link
            to="/admin"
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Back to Dashboard
          </Link>
          <button
            onClick={fetchInquiries}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {inquiries.map((inquiry) => (
          <div
            key={inquiry._id}
            className="bg-white rounded-lg shadow-md p-6 space-y-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{inquiry.name}</h3>
                <a
                  href={`mailto:${inquiry.email}`}
                  className="text-primary-600 hover:text-primary-700"
                >
                  {inquiry.email}
                </a>
                {inquiry.phone && (
                  <div className="text-sm text-gray-600">
                    Phone: {inquiry.phone}
                  </div>
                )}
                {inquiry.company && (
                  <div className="text-sm text-gray-600">
                    Company: {inquiry.company}
                  </div>
                )}
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  inquiry.status
                )}`}
              >
                {inquiry.status}
              </span>
            </div>

            <p className="text-gray-600">{inquiry.message}</p>

            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {new Date(inquiry.createdAt).toLocaleDateString()}
              </div>
              <div className="flex gap-2">
                <select
                  value={inquiry.status}
                  onChange={(e) =>
                    updateInquiryStatus(inquiry._id, e.target.value as Inquiry['status'])
                  }
                  className="px-3 py-1 border rounded-md text-sm"
                >
                  <option value="new">New</option>
                  <option value="read">Read</option>
                  <option value="responded">Responded</option>
                </select>
                <button
                  onClick={() => deleteInquiry(inquiry._id)}
                  className="p-2 text-red-600 hover:text-red-700"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InquiriesManager; 