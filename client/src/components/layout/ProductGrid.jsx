const ProductGrid = () => {
    const products = [
      {
        id: 1,
        name: "Urban Streetwear Hoodie",
        price: "$89",
        image: "https://images.unsplash.com/photo-1515465081314-cfcfe05d3716?q=80&w=388&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category: "Clothes",
      },
      {
        id: 2,
        name: "Wireless Earbuds Pro",
        price: "$199",
        image: "https://images.unsplash.com/photo-1588156979401-db3dc31817cb?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category: "Electronics",
      },
      {
        id: 3,
        name: "Minimalist Sneakers",
        price: "$129",
        image: "https://images.unsplash.com/photo-1621665421558-831f91fd0500?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category: "Shoes",
      },
      {
        id: 4,
        name: "Modern Desk Chair",
        price: "$299",
        image: "https://images.unsplash.com/photo-1748887522207-3a5a9097bc43?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category: "Furniture",
      },
      {
        id: 5,
        name: "Tech Backpack",
        price: "$79",
        image: "https://images.unsplash.com/photo-1528921581519-52b9d779df2b?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category: "Misc",
      },
      {
        id: 6,
        name: "Smart Watch Series",
        price: "$349",
        image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=327&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category: "Electronics",
      },
    ];
  
    return (
      <section className="py-24 bg-black">
        <div className="px-4 sm:px-8 md:px-12 lg:px-16">
          <h2 className="text-3xl font-bold text-white mb-10">Featured Products</h2>
          <div className="grid gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-gray-900/50 border border-gray-600/30 rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer hover:-translate-y-2 hover:bg-gray-900/80 hover:border-violet-500/50 hover:shadow-[0_25px_50px_rgba(139,92,246,0.15)]"
              >
                <div className="relative h-[300px] overflow-hidden bg-gray-700/30">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <button className="bg-violet-600 text-white px-4 py-2 rounded-md font-medium hover:bg-violet-700">
                      Quick View
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <span className="text-violet-500 text-sm font-medium uppercase tracking-wider">
                    {product.category}
                  </span>
                  <h3 className="text-xl font-semibold text-white my-2">{product.name}</h3>
                  <p className="text-2xl font-bold text-pink-400">{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };
  
  export default ProductGrid;  