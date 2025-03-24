import React from "react";

const Main = () => {
  return (
    <div
      data-framer-background-image-wrapper="true"
      className="absolute inset-0 rounded-inherit"
    >
      <img
        decoding="async"
        sizes="100vw"
        srcSet="
                https://framerusercontent.com/images/4VX0PEAzbHMFjS7HeLo6v4CcP0.png?scale-down-to=512 512w, 
                https://framerusercontent.com/images/4VX0PEAzbHMFjS7HeLo6v4CcP0.png?scale-down-to=1024 1024w, 
                https://framerusercontent.com/images/4VX0PEAzbHMFjS7HeLo6v4CcP0.png?scale-down-to=2048 2048w, 
                https://framerusercontent.com/images/4VX0PEAzbHMEjS7Helo6v4CcP0.png 2880w
            "
        src="https://framerusercontent.com/images/4VX0PEAzbHMEjS7Helo6v4CcP0.png"
        alt=""
        className="block w-full h-full rounded-inherit object-cover object-center"
      />
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-white max-w-4xl w-4/5 p-6"
      >
        <h1 className="text-4xl font-bold mb-4">Main Text</h1>
        <p className="text-lg">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quam velit laborum doloremque repellat, modi optio perspiciatis quis nemo minus iure esse unde exercitationem nulla illo necessitatibus dolore! Eveniet, et officiis!</p>
      </div>
    </div>
  );
};

export default Main;
