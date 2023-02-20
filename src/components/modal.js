import React, { useState } from "react";

export default function Modal(props) {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button
        type="button"
        className={props.classButton || null}
        onClick={() => setShowModal(true)}
      >
        {props.textButton || null}
      </button>
      {showModal ? (
        <>
          <div className="flex max-h-screen justify-center items-center overflow-hidden fixed inset-0 z-50 backdrop-blur-sm">
            <div className="relative w-auto my-6 mx-auto max-w-3xl max-h-screen">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white text-gray-600 overflow-auto max-h-screen">
                <div className="flex items-center justify-between p-4 border-b border-solid border-gray-300">
                  <h3 className="text-3xl font-semibold">
                    {props.modalTitle || props.textButton || null}
                  </h3>
                  <button
                    className="float-right"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="text-xl">x</span>
                  </button>
                </div>
                <div className="relative p-4 flex-auto">
                  {props.children || null}
                </div>
                <div className="flex items-center justify-center p-4 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-red-500 font-bold uppercase text-sm"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    {props.textClose || "Fechar"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}
