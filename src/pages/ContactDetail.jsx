// src/pages/ContactDetail.jsx
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import messagesData from '../JSON/contact.json'; // Sesuaikan path
import PageHeader from '../components/PageHeader'; // Sesuaikan path
import { FiArrowLeft, FiUser, FiMail, FiMessageSquare, FiCalendar, FiAlertTriangle, FiCheckCircle, FiInfo } from 'react-icons/fi';

export default function ContactDetail() {
    const { id: messageId } = useParams(); // id dari URL adalah string
    const navigate = useNavigate();
    const message = messagesData.find(msg => msg.id === messageId); // id dari JSON juga string

    const getStatusInfo = (status) => {
        switch (status) {
            case "Pending":
                return { text: "Pending Response", icon: <FiAlertTriangle className="mr-2 text-yellow-500" />, badgeClass: "bg-yellow-100 text-yellow-700" };
            case "Responded":
                return { text: "Responded", icon: <FiCheckCircle className="mr-2 text-green-500" />, badgeClass: "bg-green-100 text-green-700" };
            default:
                return { text: "Unknown Status", icon: <FiInfo className="mr-2 text-gray-500" />, badgeClass: "bg-gray-100 text-gray-700" };
        }
    };


    if (!message) {
        return (
            <div className="container mx-auto p-4 md:p-6 lg:p-8 text-center">
                <PageHeader title="Message Not Found" breadcrumb={["Dashboard", "Messages", "Not Found"]} />
                 <div className="mt-10 bg-white p-8 rounded-lg shadow-xl max-w-md mx-auto">
                    <FiMail size={60} className="text-red-400 mx-auto mb-6" />
                    <h2 className="text-2xl font-semibold text-gray-700 mb-3">Oops! Message Not Found</h2>
                    <p className="text-gray-500 mb-8">
                    The message with ID: <span className="font-semibold">{messageId}</span> could not be found.
                    </p>
                    <Link
                        to="/contact" // Sesuaikan dengan path list pesan Anda
                        className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg"
                    >
                        <FiArrowLeft size={20} />
                        <span>Back to Messages</span>
                    </Link>
                </div>
            </div>
        );
    }

    const statusInfo = getStatusInfo(message.status);

    return (
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
            <PageHeader 
                title={`Message: ${message.subject}`} 
                breadcrumb={["Dashboard", "Messages", `ID: ${message.id}`]}
            >
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-4 py-2.5 rounded-lg shadow hover:shadow-md"
                >
                    <FiArrowLeft size={20} />
                    <span>Back</span>
                </button>
            </PageHeader>

            <div className="mt-6 bg-white shadow-xl rounded-lg overflow-hidden">
                <div className="p-6 md:p-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-6 pb-4 border-b">
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">{message.subject}</h2>
                            <div className="text-sm text-gray-500 flex items-center space-x-4">
                                <span className="flex items-center"><FiUser className="mr-1.5"/> {message.name}</span>
                                <a href={`mailto:${message.email}`} className="flex items-center hover:text-blue-600"><FiMail className="mr-1.5"/> {message.email}</a>
                            </div>
                        </div>
                        <div className="mt-3 sm:mt-0 text-right">
                            <p className="text-xs text-gray-400 flex items-center justify-end"><FiCalendar className="mr-1.5"/> Received on</p>
                            <p className="text-sm text-gray-600 font-medium">
                                {new Date(message.date).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                    </div>
                    
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center">
                            <FiMessageSquare className="mr-2 text-gray-500"/> Message Content
                        </h3>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 p-4 rounded-md border">
                            {message.message}
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2 flex items-center">
                            {statusInfo.icon} Current Status
                        </h3>
                        <span className={`px-3 py-1.5 inline-flex text-sm leading-5 font-semibold rounded-md ${statusInfo.badgeClass}`}>
                            {statusInfo.text}
                        </span>
                       
                    </div>
                </div>
            </div>
        </div>
    );
}