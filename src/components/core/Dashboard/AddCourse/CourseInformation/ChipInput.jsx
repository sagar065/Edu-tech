import { useEffect, useState } from "react"
import { MdClose } from "react-icons/md"
import { useSelector } from "react-redux"

export default function ChipInput({
  label,
  name,
  placeholder,
  register,
  errors,
  setValue,
}) {
  const { editCourse, course } = useSelector((state) => state.course)

  // Local state for the list of tags
  const [chips, setChips] = useState([])
  // Local state for the current text being typed
  const [inputValue, setInputValue] = useState("")

  useEffect(() => {
    if (editCourse) {
      setChips(course?.tag || [])
    }
    register(name, { required: true, validate: (value) => value.length > 0 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setValue(name, chips)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chips])

  // Logic to handle adding a tag (Unified for both Button and KeyDown)
  const addChipHandler = () => {
    const trimmedValue = inputValue.trim()
    if (trimmedValue && !chips.includes(trimmedValue)) {
      setChips([...chips, trimmedValue])
      setInputValue("") // Clear the input
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault()
      addChipHandler()
    }
  }

  const handleDeleteChip = (chipIndex) => {
    const newChips = chips.filter((_, index) => index !== chipIndex)
    setChips(newChips)
  }

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm text-richblack-5" htmlFor={name}>
        {label} <sup className="text-pink-200">*</sup>
      </label>

      {/* Render the tags list */}
      <div className="flex w-full flex-wrap gap-y-2">
        {chips.map((chip, index) => (
          <div
            key={index}
            className="m-1 flex items-center rounded-full bg-yellow-400 px-2 py-1 text-sm text-richblack-900"
          >
            {chip}
            <button
              type="button"
              className="ml-2 focus:outline-none"
              onClick={() => handleDeleteChip(index)}
            >
              <MdClose className="text-sm" />
            </button>
          </div>
        ))}
      </div>

      {/* Input container with explicit Add Button */}
      <div className="flex flex-col items-start space-y-2">
        <input
          id={name}
          name={name}
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="form-style w-full"
        />
        <button
          type="button"
          onClick={addChipHandler}
          className="font-semibold text-yellow-50"
        >
          Add
        </button>
      </div>

      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {label} is required
        </span>
      )}
    </div>
  )
}