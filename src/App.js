import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Papa from 'papaparse'
import { FaRegCheckCircle, FaSyncAlt } from 'react-icons/fa'
import { RiErrorWarningFill } from 'react-icons/ri'

const SPREADSHEET_ID = '1zK87M1REzQv-YEel67nHr6JaZZeR_OOlhVwOiyqnsoI'
/*
--- SPREADSHEET SCHEMA DO NOT CHANGE ---
Activity,Resource Title,URL
,EFT Tapping,A Simple Way to Help Process Anxiety - Tapping with Brad Yate,https://www.youtube.com/watch?v=K6kq9N9Yp6E&ab_channel=BradYates
--- SPREADSHEET SCHEMA DO NOT CHANGE ---
*/

const Loading = () => (
  <p className="text-center">Loading...</p>
)

const Error = ({ message }) => (
  <div className="text-center text-red-500 flex items-center justify-center">
    <RiErrorWarningFill className="mr-2" />
    <p>{message}</p>
  </div>
)

const ListItem = ({ title, url, activity, time }) => (
  <li className="flex items-center">
    <div className="mr-3 text-gray-800">
      {time}
    </div>
    <div className="border rounded-md overflow-hidden mb-2 flex-1">
    <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between px-4 py-2 bg-white w-full">
      <div className="w-11/12">
      <h1 className="font-bold">{activity}</h1>
      <p>{title}</p>
      </div>
      <FaRegCheckCircle className="text-green-500" />
    </a>
    </div>
  </li>
)

const GradientBackground = ({ children }) => (
  <div className="bg-gradient-to-b from-pink-100 to-blue-100 min-h-screen flex justify-center items-center">
    {children}
  </div>
)

const RefreshButton = ({ onClick }) => (
  <button onClick={onClick} className="flex items-center justify-center text-gray-600 rounded-full h-12 w-12 absolute top-4 right-4">
    <FaSyncAlt />
  </button>
)

const App = () => {
  const [data, setData] = useState([])
  const [error, setError] = useState(null)
  const [randomData, setRandomData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?gid=0&format=csv`)
        const parsedData = Papa.parse(response.data, { header: true }).data
        setData(parsedData)
      } catch (error) {
        setError('Error fetching data')
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
        if (localStorage.getItem('healingVibesData')) {
      setRandomData(JSON.parse(localStorage.getItem('healingVibesData')))
    } else if (data.length) {
      const randomItems = getRandomItems(data, 5)
      setRandomData(randomItems)
      localStorage.setItem('healingVibesData', JSON.stringify(randomItems))
    }
  }, [data])

  const getRandomItems = (array, count) => {
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  const handleRefreshData = () => {
    const randomItems = getRandomItems(data, 5)
    setRandomData(randomItems)
    localStorage.setItem('healingVibesData', JSON.stringify(randomItems))
  }

  return (
    <GradientBackground>
      <div className="rounded px-8 pt-6 pb-8 mb-4 max-w-full mx-auto relative">
        <h1 className="font-semibold text-2xl mb-4">
          Healing Vibes 🍃
        </h1>
        <RefreshButton onClick={handleRefreshData} />
        {error ? <Error message={error} /> : randomData.length > 0 ? (
          <ul>
            {randomData.map((item, index) => (
              <ListItem key={index} title={item['Resource Title']} activity={item['Activity']} url={item['URL']} time={['8am', '11am', '1pm', '4pm', '7pm'][index]} />
            ))}
          </ul>
        ) : <Loading />}
      <div className="italic text-center">
        The only way out is through.
      </div>
      </div>
    </GradientBackground>
  )
}

export default App
