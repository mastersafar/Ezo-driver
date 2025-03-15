'use client'; // Ensure this runs on the client
import PageTitle from '@/components/PageTitle'; 
import { useState, useEffect } from "react";
import List from "./list";

export default function About() {
  const [items, setItems] = useState([]); // State for the fetched data
  const [page, setPage] = useState(0); // State for pagination

  // Function to fetch posts
  const fetchPosts = async (page) => {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_start=${page * 10}&_limit=10`);
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      const data = await response.json();
      setItems((prevItems) => [...prevItems, ...data]); // Append new data
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  // Fetch posts when the component mounts or the page changes
  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  return (
    <>
        <PageTitle title="التحميل الآني ">


      <ul className="grid grid-cols-3  gap-3 ">
        {items.map((item) => (
          <li key={item.id}>
            <List {...item} />
          </li>
        ))}
      </ul>

      <div className="flex justify-center mt-4">
        <button
          onClick={() => setPage((prevPage) => prevPage + 1)} // Increment page number
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Load More
        </button>
      </div>
      </PageTitle>
    </>
  );
}
