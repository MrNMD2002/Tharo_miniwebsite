"use client";

import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

// Mock Leads
const LEADS = [
    { id: 1, name: "Nguyễn Văn A", phone: "0909123456", date: "2023-11-25", message: "Tôi muốn thử mẫu Áo Dài Lụa Hồng", status: "new" },
    { id: 2, name: "Trần Thị B", phone: "0912345678", date: "2023-11-26", message: "Tư vấn size giúp mình", status: "confirmed" },
];

export default function LeadsPage() {
    return (
        <div>
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-serif font-bold text-burgundy-900">Quản lý Lịch hẹn / Leads</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Danh sách khách hàng đăng ký tư vấn hoặc thử áo.
                    </p>
                </div>
            </div>
            <div className="mt-8 flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                            Khách hàng
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Ngày hẹn
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Lời nhắn
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Trạng thái
                                        </th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                            <span className="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {LEADS.map((lead) => (
                                        <tr key={lead.id}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                                <div className="font-medium text-gray-900">{lead.name}</div>
                                                <div className="text-gray-500">{lead.phone}</div>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {lead.date}
                                            </td>
                                            <td className="px-3 py-4 text-sm text-gray-500 max-w-xs truncate">
                                                {lead.message}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${lead.status === 'new' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                                    }`}>
                                                    {lead.status === 'new' ? 'Mới' : 'Đã xác nhận'}
                                                </span>
                                            </td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                <Button size="sm" variant="ghost" className="text-green-600 hover:text-green-900 hover:bg-green-50">
                                                    <Check className="h-4 w-4" />
                                                </Button>
                                                <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-900 hover:bg-red-50">
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
