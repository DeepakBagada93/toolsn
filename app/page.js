'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import LogoSlider from './components/LogoSlider';

export default function Home() {

  const slides = [
    {
      id: 1,
      image: "https://img.freepik.com/free-photo/carpenter-working-sawmill-wood-manufacture_1303-22882.jpg?ga=GA1.1.824993792.1721567766&semt=ais_hybrid",
      title: "High-Quality Stone Cutting Machines",
      description: "Precision tools for professional craftsmen."
    },
    {
      id: 2,
      image: "https://images.pexels.com/photos/7492587/pexels-photo-7492587.jpeg?auto=compress&cs=tinysrgb&w=600",
      title: "Advanced Tile Cutting Solutions",
      description: "Durable and reliable tools for every project."
    }
  ];



  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000); // Auto change every 3 seconds

    return () => clearInterval(interval);
  }, []);


  const tools = [
    { id: 1, name: "Tool 1", img: "https://s.alicdn.com/@sc04/kf/Hb70995c421ba48798faf8e815c0a1affF.jpg_720x720q50.jpg" },
    { id: 2, name: "Tool 2", img: "https://s.alicdn.com/@sc04/kf/Hb70995c421ba48798faf8e815c0a1affF.jpg_720x720q50.jpg" },
    { id: 3, name: "Tool 3", img: "https://s.alicdn.com/@sc04/kf/Hb70995c421ba48798faf8e815c0a1affF.jpg_720x720q50.jpg" },
    { id: 4, name: "Tool 4", img: "https://s.alicdn.com/@sc04/kf/Hb70995c421ba48798faf8e815c0a1affF.jpg_720x720q50.jpg" },
    { id: 5, name: "Tool 5", img: "https://s.alicdn.com/@sc04/kf/Hb70995c421ba48798faf8e815c0a1affF.jpg_720x720q50.jpg" },
    { id: 6, name: "Tool 6", img: "https://s.alicdn.com/@sc04/kf/Hb70995c421ba48798faf8e815c0a1affF.jpg_720x720q50.jpg" },
    { id: 7, name: "Tool 7", img: "https://s.alicdn.com/@sc04/kf/Hb70995c421ba48798faf8e815c0a1affF.jpg_720x720q50.jpg" },
    { id: 8, name: "Tool 8", img: "https://s.alicdn.com/@sc04/kf/Hb70995c421ba48798faf8e815c0a1affF.jpg_720x720q50.jpg" },
    { id: 9, name: "Tool 9", img: "https://s.alicdn.com/@sc04/kf/Hb70995c421ba48798faf8e815c0a1affF.jpg_720x720q50.jpg" },
    { id: 10, name: "Tool 10", img: "https://s.alicdn.com/@sc04/kf/Hb70995c421ba48798faf8e815c0a1affF.jpg_720x720q50.jpg" },
    { id: 11, name: "Tool 11", img: "https://s.alicdn.com/@sc04/kf/Hb70995c421ba48798faf8e815c0a1affF.jpg_720x720q50.jpg" },
    { id: 12, name: "Tool 12", img: "https://s.alicdn.com/@sc04/kf/Hb70995c421ba48798faf8e815c0a1affF.jpg_720x720q50.jpg" }
  ];

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // First fetch all products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (productsError) {
        console.error('Error fetching products:', productsError.message);
        return;
      }

      // Then fetch all profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, full_name');

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError.message);
        return;
      }

      // Create a map of profiles for quick lookup
      const profilesMap = new Map(
        profilesData.map(profile => [profile.id, profile])
      );

      // Combine products with seller information
      const enrichedProducts = productsData.map(product => ({
        ...product,
        profiles: profilesMap.get(product.user_id) || null
      }));

      setProducts(enrichedProducts);
    } catch (err) {
      console.error('Exception while fetching products:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const logos = [
    { image: "company/c1.png" },
    { image: "company/c2.png" },
    { image: "company/c3.png" },
    { image: "company/c4.png" },
  ];


  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#e31c39]"></div>
    </div>
  );



  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 w-full h-[400px] mt-[200px]">
        {/* Left Content Section */}
        <div className="flex flex-col justify-center items-start p-6 bg-[#fce8eb] text-black">
          <h2 className="text-3xl font-bold">{slides[currentSlide].title}</h2>
          <p className="text-lg text-gray-700 mt-2">{slides[currentSlide].description}</p>
        </div>

        {/* Right Image Slider Section */}
        <div className="relative w-full h-[400px] overflow-hidden">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <LogoSlider logos={logos} />;

      <section className="overflow-hidden bg-[#fce8eb] sm:grid sm:grid-cols-2 sm:items-center">
        <div className="p-8 md:p-12 lg:px-16 lg:py-24">
          <div className="mx-auto max-w-xl text-center ltr:sm:text-left rtl:sm:text-right">
            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
              High-Quality Stone and Tile Machines
            </h2>

            <p className="hidden text-gray-500 md:mt-4 md:block">
              Discover our range of precision stone and tile machines designed for durability and efficiency. From cutting and polishing to installation, we have the tools you need to get the job done right.
            </p>

            <div className="mt-4 md:mt-8">
              <a
                href="#"
                className="inline-block rounded-sm bg-[#d02742] px-12 py-3 text-sm font-medium text-white transition hover:bg-[#1434A4] focus:ring-3 focus:ring-[#1434A4] focus:outline-hidden"
              >
                Shop Now
              </a>
            </div>
          </div>
        </div>

        <img
          alt="Stone and Tile Machines"
          src="https://images.pexels.com/photos/30112375/pexels-photo-30112375/free-photo-of-industrial-granite-cutting-machine-in-factory.jpeg?auto=compress&cs=tinysrgb&w=600"
          className="h-full w-full object-cover sm:h-[calc(100%_-_2rem)] sm:self-end sm:rounded-ss-[30px] md:h-[calc(100%_-_4rem)] md:rounded-ss-[60px]"
        />
      </section>





      <section className="bg-[#fce8eb] py-12">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-black mb-8 text-center">Explore Our Product Categories</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <h2 className="text-2xl font-semibold text-black mb-4">Stone Cutting Machines</h2>
              <p className="text-gray-600 mb-6">High-precision stone cutting tools for various applications.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#e31c39] p-2 rounded-lg">
                <img src="tools/t1.png" alt="Tool 1" className="w-full h-48 object-cover rounded-lg shadow-md" />
              </div>
              <div className="bg-[#e31c39] p-2 rounded-lg">
                <img src="tools/t2.png" alt="Tool 2" className="w-full h-48 object-cover rounded-lg shadow-md" />
              </div>
              <div className="bg-[#e31c39] p-2 rounded-lg">
                <img src="tools/t2.png" alt="Tool 3" className="w-full h-48 object-cover rounded-lg shadow-md" />
              </div>
            </div>

            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <h2 className="text-2xl font-semibold text-black mb-4">Tile Polishing Machines</h2>
              <p className="text-gray-600 mb-6">Efficient tile polishing tools for a perfect finish.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#e31c39] p-2 rounded-lg">
                <img src="tools/t2.png" alt="Tool 4" className="w-full h-48 object-cover rounded-lg shadow-md" />
              </div>
              <div className="bg-[#e31c39] p-2 rounded-lg">
                <img src="tools/t2.png" alt="Tool 5" className="w-full h-48 object-cover rounded-lg shadow-md" />
              </div>
              <div className="bg-[#e31c39] p-2 rounded-lg">
                <img src="tools/t2.png" alt="Tool 6" className="w-full h-48 object-cover rounded-lg shadow-md" />
              </div>
            </div>

            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <h2 className="text-2xl font-semibold text-black mb-4">Installation Tools</h2>
              <p className="text-gray-600 mb-6">Reliable tools for installing stone and tile surfaces.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#e31c39] p-2 rounded-lg">
                <img src="tools/t2.png" alt="Tool 7" className="w-full h-48 object-cover rounded-lg shadow-md" />
              </div>
              <div className="bg-[#e31c39] p-2 rounded-lg">
                <img src="tools/t2.png" alt="Tool 8" className="w-full h-48 object-cover rounded-lg shadow-md" />
              </div>
              <div className="bg-[#e31c39] p-2 rounded-lg">
                <img src="tools/t2.png" alt="Tool 9" className="w-full h-48 object-cover rounded-lg shadow-md" />
              </div>
            </div>

          </div>
        </div>
      </section>





      <div className="max-w-screen-xl mx-auto p-4">
  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
    {products.map((product) => (
      <div key={product.id} className="bg-[#e31c39] rounded-lg shadow-md overflow-hidden">
        {product.image_url && (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-48 object-cover"
          />
        )}
        <div className="p-4">
          <h2 className="text-xl font-semibold text-white mb-2">{product.name}</h2>
          <p className="text-sm text-white mb-2">Category: {product.category}</p>
          <p className="text-white mb-3">{product.description}</p>
          <p className="text-2xl font-bold text-white mb-2">${product.price}</p>
          <p className="text-sm text-white mb-2">Stock: {product.stock}</p>
          <p className="text-sm text-white">
            Seller: {product.profiles?.full_name || product.profiles?.email || 'Unknown'}
          </p>
        </div>
      </div>
    ))}
  </div>
</div>
      <section className="bg-[#fce8eb] py-12">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-black mb-8 text-center">Explore Our Tools</h1>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-4">
            {tools.map((tool) => (
              <div
                key={tool.id}
                className="flex flex-col items-center p-4 bg-[#e31c39] rounded-lg shadow-md transition-transform duration-300 hover:scale-110"
              >
                <div className="w-20 h-20 bg-[#e31c39] rounded-full flex items-center justify-center mb-2">
                  <img
                    src={tool.img}
                    alt={tool.name}
                    className="w-16 h-16 object-cover rounded-full transition-transform duration-300 hover:scale-125"
                  />
                </div>
                <p className="text-sm font-medium text-white">{tool.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



      <section className="bg-[#fce8eb] py-12">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-black mb-4">Tooldocker – Leading B2B e-Commerce for Industrial Products</h2>
              <p className="text-gray-600">To combat the negative impact of delays in sourcing to the production process, tooldocker assists you in a hassle-free online buying process and create an easy way to handle the industrial product procurement process. Our aim is to help you make substantial savings in supplies, raise the efficiency level of your inventory management and help you to sustain your growth. We want to make online business to business and business to consumer procurement a time saving and smooth process. The procurement of industrial products and business supplies by tradition means it is often a time consuming task. To simplify this process, tooldocker has emerged as the perfect platform through which companies, as well as suppliers, can procure industrial tools and equipment in a time-bound manner.</p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-black mb-4">Exceptional Buying Experience with T</h2>
              <p className="text-gray-600">For a memorable buying experience, we come up with attractive discounts on different products on a periodic basis and GST invoicing that removes tax cascading with easy tax filing. Our Tooldocker Credit Line allows customer to buy product on credit. Other payment modes include COD, Debit and Credit Card Payment, Net Banking, Mobile Wallets, etc. Also, we have Request for Quotes (RFQ) feature that allows buyers to purchase in bulk without making them feel a pinch in their pockets while buying industrial goods. We have an efficient and quick customer support team that resolves all queries and grievances of customers.</p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-black mb-4">Shop from the Wide Range of B2B Product</h2>
              <p className="text-gray-600">As a leading industrial equipment supplier, at present, Tooldocker has 3 lac SKUs, 250K+ SME clients, 5000+ suppliers and 35+ categories. We have a plethora of industrial and business supplies including Safety: Catering to every industry safety needs, we offer safety gear like safety shoes, signages, safety helmets, etc. Since Personal Protective Equipment (PPE) are mandatory for employees to wear at work, shop the best safety equipment from Tooldocker. Power Tools: These effective and efficient tools help finish a task in-time. There are fixed and portable in nature. Tooldocker has both commercial and industrial power tools for DIYers, shop owners or industrial workers. Appliances: Tooldocker offers a range of quality appliances and utilities for your business needs. Make your organization a 'home away from home' for your employees and increase work efficiency. Office Supplies: For maximum productivity at workplace, Tooldocker offers a range of office stationery and supplies at a reasonable price. These ease life of employees and employers by increasing efficiency and safety at an organization. Other MRO supplies include Pumps & Motors, Laboratory Supplies, Electricals, Lubricants, Hand Tools, Hydraulics & Pneumatics and so on.</p>
            </div>

            <div className="p-6 bg-white rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-black mb-4">Purchase Industrial Equipment Online from Tooldocker Website</h2>
              <p className="text-gray-600">Users can navigate seamlessly through our site and acquire information about any industrial product they are looking for. We have entered into tie-ups with leading logistics companies to ensure timely delivery of industrial suppliers to the doorstep of our customers, covering over 25,000 pin codes across India. All the products sourced by us undergo a number of quality tests before being dispatched for delivery. These industrial tools are compliant with all existing quality benchmarks laid down by ISI. Therefore, they can be used over a long span of time by users in workshop-based as well as industrial applications. Therefore, to have a unique experience of buying industrial tools and products online, select from our assorted range of products. To match up with the changing expectations of buyers, we have tied up with suppliers based both in India and abroad. To make the selection process hassle free for our buyers, we update all our categories with new products along with their specifications on a regular basis. This makes it easy for buyers to compare the different industrial products offered by different brands and opt for the one which serves their needs perfectly.</p>
            </div>
          </div>
        </div>
      </section>


      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-[#000000] sm:text-4xl">
            Trusted by the Stone & Tile Cutting Industry
          </h2>

          <p className="mt-4 text-[#000000] sm:text-xl">
            Precision, durability, and innovation in every machine. Delivering excellence to stone processing businesses worldwide.
          </p>
        </div>

        <dl className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col rounded-lg border border-[#ffffff] px-4 py-8 text-center">
            <dt className="order-last text-lg font-medium text-[#000000]">Machines Sold</dt>
            <dd className="text-4xl font-extrabold text-[#e31c39] md:text-5xl">12,000+</dd>
          </div>

          <div className="flex flex-col rounded-lg border border-[#ffffff] px-4 py-8 text-center">
            <dt className="order-last text-lg font-medium text-[#000000]">Global Clients</dt>
            <dd className="text-4xl font-extrabold text-[#e31c39] md:text-5xl">5,000+</dd>
          </div>

          <div className="flex flex-col rounded-lg border border-[#ffffff] px-4 py-8 text-center">
            <dt className="order-last text-lg font-medium text-[#000000]">Years of Experience</dt>
            <dd className="text-4xl font-extrabold text-[#e31c39] md:text-5xl">25+</dd>
          </div>

          <div className="flex flex-col rounded-lg border border-[#ffffff] px-4 py-8 text-center">
            <dt className="order-last text-lg font-medium text-[#0a0203]">Customer Satisfaction</dt>
            <dd className="text-4xl font-extrabold text-[#e31c39] md:text-5xl">98%</dd>
          </div>
        </dl>
      </div>







    </div>

  );
}