import { ClockIcon } from "@heroicons/react/20/solid";

export default function ui() {
  return (
    <>
      <div className="mt-4">
        <h2 className="text-xl">Buttons</h2>
        <button className="btn btn-primary mt-3">
          {"Get started -> it's free"}
        </button>
        <button className="btn btn-secondary ml-3">Secondary</button>
        <button className="btn btn-action ml-3">Action</button>
        <button className="btn btn-danger ml-3">Delete</button>
        <button className="btn btn-action  btn-normal ml-3">
          <ClockIcon className="h-5 w-5" />
        </button>
        <button
          className="btn btn-primary mt-3 flex cursor-wait flex-row"
          disabled
        >
          <svg
            className="-ml-1 mr-3 h-5 w-5 animate-spin text-white dark:text-primary-300"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>Loading...</span>
        </button>
      </div>
      <div className="mt-4 max-w-md">
        <h2 className="text-xl">Inputs</h2>
        <form className="mt-3">
          <label htmlFor="email" className="pl-1">
            Email
          </label>

          <div className="mt-1">
            <input
              type="text"
              id="email"
              className="input w-full"
              placeholder="Enter your email"
            />
          </div>
          <div className="mt-4">
            <label htmlFor="message" className="pl-1">
              Your message
            </label>
          </div>
          <div className="mt-1">
            <textarea
              className="input w-full"
              id="message"
              placeholder="Your message"
            ></textarea>
          </div>

          <button className="btn btn-primary mt-3 w-full font-bold">
            Submit
          </button>
        </form>
      </div>
    </>
  );
}
