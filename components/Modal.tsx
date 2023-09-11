"use client";
import { FormEvent, Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useModalStore } from "@/store/ModalStore";
import { useBoardStore } from "@/store/BoardStore";
import TaskTypeRadioGroup from "./TaskTypeRadioGroup";
import Image from "next/image";
import { PhotoIcon } from "@heroicons/react/24/solid";

function Modal() {
  const [addTask, newTaskType, image, setImage, newTaskInput, setNewTaskInput] =
    useBoardStore((state) => [
      state.addTask,
      state.newTaskType,
      state.image,
      state.setImage,
      state.newTaskInput,
      state.setNewTaskInput,
    ]);
  const [isOpen, closeModal] = useModalStore((state) => [
    state.isOpen,
    state.closeModal,
  ]);
  const imagePickerRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (passedForm: FormEvent<HTMLFormElement>) => {
    // prevent default form action i.e refreshing page
    passedForm.preventDefault();
    // if nothing was passed
    if (!passedForm) {
      return;
    }
    // add task to board
    addTask(newTaskInput, newTaskType, image);
    // clear image and close modal
    setImage(null);
    closeModal();
  };

  return (
    // Use the `Transition` component at the root level
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        // render as a form
        as="form"
        onSubmit={handleSubmit}
        // styling: z-index of ten and relative positioning
        className={"relative z-10"}
        onClose={closeModal}
      >
        {/*
          You want to have one transition child for the backdrop, and another for the form
          Use one Transition.Child to apply one transition to the backdrop...
        */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            {/* The second transition child won't have have background opacity. 
            This one will display the form */}
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              {/* Dialog section to display Header, and input  other fields */}
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 pb-2"
                >
                  Add a Task
                </Dialog.Title>
                {/* Task Input Form */}
                <div>
                  <input
                    type="text"
                    value={newTaskInput}
                    onChange={(text) => setNewTaskInput(text.target.value)}
                    placeholder="Enter new task..."
                    className="w-full border border-gray-300 rounded-md outline-none p-5"
                  />
                </div>
                {/* Radio Group From TaskTypeRadioGroup */}
                <TaskTypeRadioGroup />
                {/* Nice upload image button link with ref to hidden upload button */}

                <div className="mt-2">
                  <button
                    onClick={() => imagePickerRef.current?.click()}
                    type="button"
                    className="w-full border border-gray-300 rounded-md outline-none p-5 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  >
                    <PhotoIcon className="h-6 w-6 mr-2 inline-block" />
                    Upload Image
                  </button>
                  {/* Check if image has been uploaded -> it isn't null */}
                  {image && (
                    <Image
                      alt="Uploaded Image"
                      width={200}
                      height={200}
                      className="w-full h-44 object-cover mt-2 filter hover:grayscale
                    transition-all duration-150 cursor-not-allowed"
                      src={URL.createObjectURL(image)}
                    />
                  )}
                  {/* image upload button */}
                  <input
                    type="file"
                    hidden
                    // hidden cause the button is ugly haha. I am going to attach the ref to a nicer looking booking so that is what triggers the file selection
                    // This is why I am using a ref. when you click the ref, the input is triggered. Web scrappers see this as a selected input...
                    ref={imagePickerRef}
                    onChange={(file) => {
                      // check if file is an image. If not true, return
                      if (!file.target.files![0].type.startsWith("image/"))
                        return;
                      setImage(file.target.files![0]);
                    }}
                  />
                </div>
                {/* Add Task Button */}
                <button
                  type="submit"
                  disabled={!newTaskInput}
                  className="mt-2 inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed"
                >
                  {" "}
                  Add Task
                </button>
              </Dialog.Panel>
              {/* <div className="fixed inset-0 bg-black bg-opacity-25" /> */}
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default Modal;
