import React from 'react'

const SubscribeSection = () => {
  return (
    <section className="w-full bg-gradient-to-br from-purple-900 to-purple-800 py-16 px-4 rounded-3xl mt-15">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-white mb-4">Stay Updated</h2>
        <p className="text-lg text-purple-200 mb-8">
          Subscribe to our newsletter for exclusive deals, new arrivals, and more.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
          <input
            type="email"
            placeholder="Your email address"
            className="flex-1 px-6 py-3 rounded-lg bg-purple-800/50 border border-purple-600/30 text-white placeholder-purple-300 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
          />
          <button className="px-8 py-3 bg-gradient-to-r from-slate-500 to-purple-500 text-white font-semibold rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500/20">
            Subscribe
          </button>
        </div>
      </div>
    </section>
  )
}

export default SubscribeSection