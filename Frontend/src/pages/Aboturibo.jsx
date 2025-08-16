import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Header from "../component/Header";
import Footer from "../component/Footer";

const Aboturibo = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {/* Main content grows to push footer down */}
      <main className="max-w-5xl mx-auto px-4 py-12 flex-grow">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1
            className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Ibyerekeye Urubuga rwacu
          </motion.h1>

          <motion.div
            className="prose prose-lg max-w-none text-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <p className="text-lg leading-relaxed mb-6">
              Urubuga rwacu rutanga amakuru agezweho, afatika kandi yizewe ku
              bikorwa bitandukanye by'igihugu, nk'ubukungu, imibereho, uburezi,
              siporo, ubuhanzi n'ibindi.
            </p>

            <motion.div
              className="bg-blue-50 p-6 rounded-lg mb-8 border border-blue-100"
              whileHover={{ scale: 1.01 }}
            >
              <h2 className="text-2xl font-semibold text-blue-800 mb-4">
                Intego yacu
              </h2>
              <p className="mb-4">
                Intego yacu ni ugutangaza inkuru zifasha Abanyarwanda gusobanukirwa
                n'ibibera mu gihugu, tukabagezaho amakuru mu buryo buboroheye kandi
                bushimishije.
              </p>
              <p>
                Twiyemeje gukora itangazamakuru ryubaka, rinyura mu mucyo kandi
                riharanira iterambere ry'igihugu n'abagituye.
              </p>
            </motion.div>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Icyo dukora
            </h2>
            <ul className="grid md:grid-cols-2 gap-6 mb-8">
              {[
                {
                  title: "Amakuru y'ubukungu",
                  description:
                    "Inkuru zihariye ku mibereho y'ubukungu n'imicungire y'amafaranga",
                },
                {
                  title: "Uburezi n'ubumenyi",
                  description:
                    "Amakuru y'imikoreshereze y'ikoranabuhanga no kwiga",
                },
              ].map((item, index) => (
                <motion.li
                  key={index}
                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
                  whileHover={{ y: -3 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <h3 className="font-bold text-lg text-blue-700 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.description}</p>
                </motion.li>
              ))}
            </ul>
            <motion.div
              className="text-center mt-12 pt-6 border-t border-gray-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-gray-600">
                Murakoze kudusura! Turi kumwe mw'iterambere ry'u Rwanda.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>

        <div className="mt-12">
          <h1 className="text-xl font-semibold mb-4">About Us (Users)</h1>
          <ul className="list-disc list-inside">
            {users.map((user) => (
              <li key={user._id}>{user.username || user._id}</li>
            ))}
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Aboturibo;
