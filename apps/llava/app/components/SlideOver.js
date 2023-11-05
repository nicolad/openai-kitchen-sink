import { Fragment } from "react";
import { Dialog, Transition, Listbox } from "@headlessui/react";
import {
  XMarkIcon,
  ChevronUpDownIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";

export default function SlideOver({
  open,
  setOpen,
  systemPrompt,
  setSystemPrompt,
  temp,
  setTemp,
  topP,
  setTopP,
  maxTokens,
  setMaxTokens,
  versions,
  size,
  setSize,
  handleSubmit,
}) {
  return (
    <Transition.Root show={open ? true : false} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <form
                    onSubmit={(e) => handleSubmit(e)}
                    className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl"
                  >
                    <div className="h-0 flex-1 overflow-y-auto">
                      <div className="bg-gray-700 px-4 py-6 sm:px-6">
                        <div className="flex items-center justify-between">
                          <Dialog.Title className="text-base font-semibold leading-6 text-white">
                            🌋 Chat with Llava
                          </Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="rounded-md bg-gray-700 text-gray-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                              onClick={() => setOpen(false)}
                            >
                              <span className="sr-only">Close panel</span>
                              <XMarkIcon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </div>
                        <div className="mt-1">
                          <p className="text-sm text-gray-300">
                            A project from Replicate.
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="divide-y divide-gray-200 px-4 sm:px-6">
                          <div className="space-y-6 pb-5 pt-6">
                            <div>
                              <label
                                htmlFor="description"
                                className="block font-bold text-sm leading-6 text-gray-900"
                              >
                                System Prompt
                              </label>
                              <p
                                id="system-prompt-description"
                                className="mt-2 text-xs text-gray-500"
                              >
                                This is prepended to the prompt and helps guide
                                system behavior.
                              </p>
                              <div className="mt-3">
                                <textarea
                                  id="systemPrompt"
                                  name="systemPrompt"
                                  rows={4}
                                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                                  value={systemPrompt}
                                  onChange={(e) =>
                                    setSystemPrompt(e.target.value)
                                  }
                                />
                              </div>
                            </div>
                          </div>
                          <div className="space-y-6 pb-5 pt-6">
                            <div>
                              <label
                                htmlFor="temperature"
                                className="block text-sm font-bold leading-6 text-gray-900"
                              >
                                Temperature - {temp}
                              </label>
                              <p
                                className="mt-2 text-xs text-gray-500"
                                id="temperature-description"
                              >
                                Adjusts randomness of outputs, greater than 1 is
                                random and 0 is deterministic, 0.75 is a good
                                starting value.
                              </p>
                              <div className="mt-3">
                                <input
                                  id="temperature"
                                  type="range"
                                  min="0.01"
                                  onChange={(e) => setTemp(e.target.value)}
                                  value={temp}
                                  max="5"
                                  step="0.01"
                                  name="temperature"
                                  className="w-full h-1 bg-gray-100 accent-gray-500  rounded-lg appearance-none cursor-pointer"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="space-y-6 pb-5 pt-6">
                            <div>
                              <label
                                htmlFor="temperature"
                                className="block text-sm font-bold leading-6 text-gray-900"
                              >
                                Max Tokens - {maxTokens}
                              </label>
                              <p
                                className="mt-2 text-xs text-gray-500"
                                id="temperature-description"
                              >
                                Maximum number of tokens to generate. A word is
                                generally 2-3 tokens.
                              </p>
                              <div className="mt-3">
                                <input
                                  id="maxTokens"
                                  type="range"
                                  min="1"
                                  onChange={(e) => setMaxTokens(e.target.value)}
                                  value={maxTokens}
                                  max="4096"
                                  step="1"
                                  name="maxTokens"
                                  className="w-full h-1 bg-gray-100 accent-gray-500  rounded-lg appearance-none cursor-pointer"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="space-y-6 pb-5 pt-6">
                            <div>
                              <label
                                htmlFor="temperature"
                                className="block text-sm font-bold leading-6 text-gray-900"
                              >
                                Top P - {topP}
                              </label>
                              <p
                                className="mt-2 text-xs text-gray-500"
                                id="temperature-description"
                              >
                                When decoding text, samples from the top p
                                percentage of most likely tokens; lower to
                                ignore less likely tokens.
                              </p>
                              <div className="mt-3">
                                <input
                                  id="topP"
                                  type="range"
                                  min="0.01"
                                  onChange={(e) => setTopP(e.target.value)}
                                  value={topP}
                                  max="1"
                                  step="0.01"
                                  name="topP"
                                  className="w-full h-1 bg-gray-100 accent-gray-500 rounded-lg appearance-none cursor-pointer"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
