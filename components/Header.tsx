"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
// Import needed icons from heroicons
import {
  MagnifyingGlassCircleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";
import Avatar from "react-avatar";
import { useBoardStore } from "@/store/BoardStore";
import fetchSuggestion from "@/lib/fetchSuggestion";

function Header() {
  const [board,searchString, setSearchString] = useBoardStore((state)=>[
    state.board,
    state.searchString,
    state.setSearchString
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  const [suggestion, setSuggestion] = useState<string>("");


  useEffect(()=>{
    // dont fetch suggestions if board columns are zero. Maps have size value
    if (board.columns.size === 0) {
      return;
    }
    setLoading(true);
    const fetchSuggestionFunction = async () => {
      // take the board and call open ai. This is done with fetchSuggestion defined in lib folder
      const suggestion = await fetchSuggestion(board);
      setSuggestion(suggestion);
      setLoading(false);
    };
    fetchSuggestionFunction();

  },[board])
  return (
    <header>
      <div className="flex flex-col md:flex-row items-center p-5 bg-gray-500/10 rounded-b-2xl">
        {/* To create background gradient effect, we are going to be using a hidden div */}
        <div
          className="
          absolute
          top-0
          left-0
          w-full
          h-96
          bg-gradient-to-br
          from-pink-400
          to-[#0055D1]
          rounded-md
          filter
          blur-3xl
          opacity-50
          -z-50


        "
        />
        {/* Image Logo */}
        {/* Note that image must be whitelisted by hostname. See next config file */}
        <Image
          src="https://links.papareact.com/c2cdd5"
          alt="Trello Logo in Header Component"
          width={300}
          height={100}
          // Style: 44 width on mobile, For medium screen width of 56, padding bottom of 10, medium screen pb is pb-0, object should contain itself
          className="w-44 md:w-56 pb-10, md:pb-0 object-contain"
        />

        {/* Search Box Component in Header Containing Text Form and Avatar */}
        <div className="flex items-center space-x-5 flex-1 justify-end w-full">
          {/* Search Box */}
          <form className="flex items-center space-x-5 bg-white rounded-md p-2 shadow-md flex-1 md:flex-initial">
            <MagnifyingGlassCircleIcon className="h-6 w-6 text-gray-400" />
            <input
              type="text"
              placeholder="Search Tasks"
              value={searchString}
              onChange={text => setSearchString(text.target.value)}
              className="flex-1 outline-none p-2"
            />
            {/* Icon from heroicons.com */}
            <button type="submit" hidden>
              Search
            </button>
          </form>

          {/* Avatar Using React Avatar Library*/}
          <Avatar name="Suleiman Odetoro" round color="#0055D1" size="50" />
        </div>
      </div>
      <div className="flex items-center justify-center px-5 py-2 md:py-5 ">
        <p className="flex items-center p-5 text-sm font-light pr-5 shadow-xl rounded-xl w-fit bg-white italic max-w-3xl text-[#0055d1]">
          <UserCircleIcon className={`inline-block h-10 w-10 text-[#0055D1] mr-1 ${loading && 'animate-spin'}`} />
          {suggestion && !loading ? suggestion : 'GPT is summarizing your tasks for the day ...'}
        </p>
      </div>
    </header>
  );
}

export default Header;
