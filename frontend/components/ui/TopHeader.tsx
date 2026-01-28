import { useEffect, useRef } from "react";
import { FaCalendarAlt, FaArrowLeft, FaArrowRight, FaAlignLeft } from "react-icons/fa";
export function TopHeader() {
    return (
        <div className="w-full bg-white border-b border-gray-100 pb-16">
            <div className="max-w-7xl mx-auto px-4 lg:px-8">
                <div className="flex flex-col md:flex-row-reverse justify-between items-center gap-12">

                    {/* بخش تقویم مدرن - سمت راست */}
                    <div className="flex flex-col items-center md:items-end border-r-0 md:border-r-4 border-gray-900 md:pr-8">
                        <span className="text-sm tracking-[0.3em] font-black text-otd-blue uppercase mb-1">
                            JANUARY
                        </span>
                        <h1 className="text-8xl md:text-9xl font-black leading-none tracking-tighter text-gray-900">
                            ۲۸
                        </h1>
                        <div className="text-lg font-bold text-gray-400 mt-2 flex items-center gap-2">
                            <span>چهارشنبه</span>
                            <span className="w-1.5 h-1.5 bg-gray-200 rounded-full" />
                            <span>۱۴۰۴</span>
                        </div>
                    </div>

                    {/* بخش محتوا و تایپوگرافی بزرگ - سمت چپ */}
                    <div className="text-center md:text-right flex-1">
                        <h2 className="text-5xl lg:text-8xl font-black text-gray-900 leading-[1.1] mb-8 tracking-tight">
                            امروز در  <br />
                            <span className="text-otd-blue">تاریخ ورزش</span>
                        </h2>

                        <p className="text-gray-500 max-w-2xl md:mr-0 mr-auto ml-auto text-xl lg:text-2xl leading-relaxed font-medium">
                            امروز <strong className="text-gray-900 underline decoration-otd-blue decoration-4 underline-offset-8">۸ بهمن</strong> است؛
                            روزی که رکوردها شکسته شدند.
                        </p>

                        {/* ناوبری ساده و شیک */}
                        <div className="mt-12 flex flex-wrap items-center justify-center md:justify-start gap-8 text-sm font-black uppercase tracking-widest">
                            <button className="text-gray-300 hover:text-otd-blue transition-colors">
                                <FaArrowRight className="inline-block mr-2"></FaArrowRight>      ۲۷ ژانویه
                            </button>

                            <button className="bg-gray-900 text-white px-10 py-4 rounded-full hover:bg-otd-blue transition-all flex items-center gap-2">
                                <FaCalendarAlt className="inline-block"></FaCalendarAlt>      تقویم کامل
                            </button>

                            <button className="text-gray-300 hover:text-otd-blue transition-colors">
                                <FaArrowLeft className="inline-block mr-2"></FaArrowLeft>      ۲۹ ژانویه
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}