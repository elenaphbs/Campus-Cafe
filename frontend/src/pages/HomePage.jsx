import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function HomePage({ setRole }) {
  const navigate = useNavigate()

  useEffect(() => {
    setRole('none')
  }, [setRole])

  return (
    <div className="home-page">
      <h1>CAMPUS CAFE</h1>
      <p>4 N Second Street, San Jose, CA 95113</p>
      <div className="home-buttons">
        <button
          className="btn-primary"
          onClick={() => { setRole('customer'); navigate('/menu') }}
        >
          Order Now
        </button>
      </div>
    </div>
  )
}

export default HomePage
