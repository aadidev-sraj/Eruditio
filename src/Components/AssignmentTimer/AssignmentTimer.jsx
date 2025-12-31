import { useState, useEffect } from "react"
import "./AssignmentTimer.css"

const AssignmentTimer = ({ expiresAt, onTimeExpired }) => {
    const [timeRemaining, setTimeRemaining] = useState(0)
    const [expired, setExpired] = useState(false)

    useEffect(() => {
        if (!expiresAt) return

        const updateTimer = () => {
            const now = Date.now()
            const remaining = Math.max(0, new Date(expiresAt).getTime() - now)

            setTimeRemaining(remaining)

            if (remaining === 0 && !expired) {
                setExpired(true)
                if (onTimeExpired) {
                    onTimeExpired()
                }
            }
        }

        // Update immediately
        updateTimer()

        // Update every second
        const interval = setInterval(updateTimer, 1000)

        return () => clearInterval(interval)
    }, [expiresAt, expired, onTimeExpired])

    const formatTime = (ms) => {
        const totalSeconds = Math.floor(ms / 1000)
        const hours = Math.floor(totalSeconds / 3600)
        const minutes = Math.floor((totalSeconds % 3600) / 60)
        const seconds = totalSeconds % 60

        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
    }

    const getTimerClass = () => {
        if (expired) return "timer-expired"
        if (timeRemaining < 600000) return "timer-warning" // Less than 10 minutes
        return "timer-normal"
    }

    return (
        <div className={`assignment-timer ${getTimerClass()}`}>
            <div className="timer-icon">⏱️</div>
            <div className="timer-content">
                <div className="timer-label">Time Remaining</div>
                <div className="timer-value">{formatTime(timeRemaining)}</div>
                {expired && <div className="timer-expired-text">Time's Up!</div>}
            </div>
        </div>
    )
}

export default AssignmentTimer
