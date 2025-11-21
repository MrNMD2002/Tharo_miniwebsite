import { LeadForm } from "@/components/forms/lead-form";

export default function ContactPage() {
    return (
        <div className="bg-cream-50 py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:text-center">
                    <h2 className="text-3xl font-serif font-bold tracking-tight text-burgundy-900 sm:text-4xl">
                        Liên hệ & Đặt lịch
                    </h2>
                    <p className="mt-2 text-lg leading-8 text-burgundy-700">
                        Hãy để Tharo tư vấn chiếc áo dài phù hợp nhất với bạn.
                    </p>
                </div>
                <div className="mx-auto mt-16 max-w-xl sm:mt-20">
                    <div className="bg-white p-8 shadow-lg rounded-2xl">
                        <LeadForm />
                    </div>
                </div>
            </div>
        </div>
    );
}
