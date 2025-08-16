import React, { createContext, useContext, useState } from 'react'

const SearchContext = createContext()

export const useSearch = () => {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}

export const SearchProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  const allContent = [
    {
      title: "Kwibohora31: Nyagatare habaye urugendo rugana aho Inkotanyi zafashe bwa mbere",
      content: "Abaturage n'abayobozi bavuye hirya no hino mu Burasirazuba bw'u Rwanda barizihiriza Isabukuru yo Kwibohora ku nshuro ya 31 mu gataka ka mbere Inkotanyi zafashe mu 1990 k'ahitwa i Gikoba mu Murenge wa Tabagwe w'Akarere ka Nyagatare.",
      category: "Amakuru",
      page: "/amakuru",
      time: "4 hours ago"
    },
    {
      title: "Amahugurwa y'abakozi: Uruganda rw'amafaranga ruzagera ku bimiliyari 500 kugeza mu 2026",
      content: "Ubuyobozi bw'uruganda rukomeye rw'amafaranga rwemeje ko ruzagera ku bimiliyari 500 z'amafaranga y'u Rwanda mu myaka itanu iri imbere.",
      category: "Ubukungu",
      page: "/ubukungu",
      time: "3 hours ago"
    },
    {
      title: "Ubucuruzi bw'ibinyabuzima mu Rwanda bwiyongereye 15% mu mwaka ushize",
      content: "Raporo y'urwego rushinzwe ubucuruzi bw'ibinyabuzima yerekana ko inyongera y'ubukungu igeze kuri 15% mu mwaka ushize.",
      category: "Ubukungu",
      page: "/ubukungu",
      time: "2 hours ago"
    },
    {
      title: "Mama Dawe - Bushali",
      content: "4.7K views 9 hours ago",
      category: "Muzika",
      page: "/ibihangano",
      time: "9 hours ago"
    },
    {
      title: "Mu myaka itanu abaturage bose ba Nyagatare bazaba bagerwaho n'amazi meza",
      content: "Ubuyobozi bw'akarere ka Nyagatare bwemeje ko abaturage bose bazaba bagerwaho n'amazi meza mu myaka itanu iri imbere.",
      category: "Ubujyanama",
      page: "/ubujyanama",
      time: "2-07-2025 - 11:36"
    },
    {
      title: "Bosco Nshuti yaririmbiјe abo muri Finland mbere yo gutaramira i Kigali",
      content: "Umuhanzi Bosco Nshuti yakoze concert muri Finland mbere yo gusubira mu Rwanda.",
      category: "Ubuhanzi",
      page: "/ahabanza",
      time: "2-07-2025 - 11:36"
    }
  ]

  const performSearch = (term) => {
    if (!term.trim()) {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    const filtered = allContent.filter(item =>
      item.title.toLowerCase().includes(term.toLowerCase()) ||
      item.content.toLowerCase().includes(term.toLowerCase()) ||
      item.category.toLowerCase().includes(term.toLowerCase())
    )

    setTimeout(() => {
      setSearchResults(filtered)
      setIsSearching(false)
    }, 300)
  }

  const clearSearch = () => {
    setSearchTerm('')
    setSearchResults([])
    setIsSearching(false)
  }

  const value = {
    searchTerm,
    setSearchTerm,
    searchResults,
    isSearching,
    performSearch,
    clearSearch
  }

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  )
}
