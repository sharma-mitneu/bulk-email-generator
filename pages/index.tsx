import { useState } from "react";
import { FiUpload, FiSend } from "react-icons/fi";

export default function Home() {
    const [emails, setEmails] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("Hi {sender},\n\nI am interested in the {role} position at {company}.");
    const [role, setRole] = useState("");
    const [company, setCompany] = useState("");
    const [sender, setSender] = useState("");
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const sendEmails = async () => {
        setLoading(true);
    
        const formData = new FormData();
        formData.append("emails", emails);
        formData.append("subject", subject);
        formData.append("message", message);
        formData.append("role", role);
        formData.append("company", company);
        formData.append("sender", sender);
        if (file) formData.append("resume", file);
    
        try {
            const res = await fetch("/api/send-email", { 
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    emails,
                    subject,
                    message,
                    role,
                    company,
                    sender
                }),
            });            
            if (!res.ok) throw new Error(await res.text());
    
            const data = await res.json();
            alert("Emails sent!");
        } catch (error) {
            alert(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
                <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">📩 Bulk Email Sender</h1>

                {/* Email Input */}
                <textarea
                    className="w-full border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 mb-4"
                    placeholder="Emails (comma-separated)"
                    rows="3"
                    onChange={(e) => setEmails(e.target.value)}
                />

                {/* Subject Input */}
                <input
                    type="text"
                    className="w-full border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 mb-4"
                    placeholder="Email Subject"
                    onChange={(e) => setSubject(e.target.value)}
                />

                {/* Message Input */}
                <textarea
                    className="w-full border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 mb-4"
                    rows="5"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <input
                        type="text"
                        className="border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500"
                        placeholder="Role"
                        onChange={(e) => setRole(e.target.value)}
                    />
                    <input
                        type="text"
                        className="border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500"
                        placeholder="Company"
                        onChange={(e) => setCompany(e.target.value)}
                    />
                    <input
                        type="text"
                        className="border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500"
                        placeholder="Your Name (Sender)"
                        onChange={(e) => setSender(e.target.value)}
                    />
                </div>

                {/* File Upload */}
                <label className="flex items-center justify-center w-full p-3 border-2 border-dashed border-gray-400 rounded-md cursor-pointer hover:border-blue-500 transition">
                    <FiUpload className="text-blue-500 mr-2" />
                    <span className="text-gray-600">{file ? file.name : "Upload Resume (PDF)"}</span>
                    <input type="file" className="hidden" accept="application/pdf" onChange={(e) => setFile(e.target.files[0])} />
                </label>

                {/* Send Button */}
                <button
                    className="mt-6 w-full flex items-center justify-center bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
                    onClick={sendEmails}
                    disabled={loading}
                >
                    {loading ? "Sending..." : <><FiSend className="mr-2" /> Send Emails</>}
                </button>
            </div>
        </div>
    );
}
