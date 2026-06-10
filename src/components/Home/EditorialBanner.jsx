import React from 'react'

const EditorialBanner = ({badge,title,description,buttonText,watermark,darkBg}) => {
  return (
   <div
  className={`rounded-[1.5rem] p-8 sm:p-12 relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6 border transition-all duration-500 ${
    darkBg
      ? "bg-zinc-950 text-white border-zinc-900"
      : "bg-white text-zinc-900 border-zinc-200/60 shadow-sm dark:bg-zinc-950 dark:text-white dark:border-zinc-900"
  }`}
>
  <div className="space-y-4 max-w-xl z-10 text-left">
    <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-400 uppercase">
      {badge}
    </span>

    <h3 className={`text-3xl sm:text-4xl font-display font-bold tracking-tight leading-none ${darkBg ? "text-white" : "dark:text-black dark:text-white"}`}>
      {title}
    </h3>

    <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed font-normal">
      {description}
    </p>
  </div>

  <button
    className={`shrink-0 transition-colors font-bold text-sm px-6 py-3 rounded-xl z-10 ${
      darkBg
        ? "bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800"
        : "bg-black text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
    }`}
  >
    {buttonText}
  </button>

  <div className="absolute top-0 right-0 w-1/3 h-full pointer-events-none opacity-10 select-none hidden sm:block">
    <div className="text-[12rem] font-black tracking-tighter text-white select-none translate-x-20 translate-y-10">
      {watermark}
    </div>
  </div>
</div>
  )
}

export default EditorialBanner
