const ArticleCard = () => {
  return (
    <div className="py-5">
      <div className="pt-5 pb-5 flex flex-col gap-2 border border-gray-400 px-4 md:px-5 max-w-56 md:max-w-72 h-auto justify-center items-center relative">
        <h1 className="font-semibold text-sm md:text-base">Article title</h1>

        <a href="" className="w-5 h-5 z-50 absolute top-2 right-2">
          <img
            src="/link.png"
            className="w-4 h-4 md:w-5 md:h-5"
            alt="link icon"
          />
        </a>

        <img
          src="images.jpg"
          className="w-32 h-32 md:w-40 md:h-40"
          alt="Article"
        />

        <p className="overflow-y-scroll h-32 md:h-44 text-xs md:text-sm text-gray-500">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Praesentium
          dolorum doloribus dignissimos tempore officiis. Eos autem quisquam
          accusamus magni laborum esse nemo animi ducimus architecto, nobis
          facilis. Numquam, excepturi dolor. Lorem ipsum dolor sit amet
          consectetur adipisicing elit. Sed voluptatum molestias fugiat
          temporibus neque, error hic consectetur quia quibusdam suscipit
          architecto qui reiciendis natus. Corporis numquam et quia voluptates
          quod. Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Laudantium, saepe? Nobis earum eligendi perspiciatis tempora nesciunt
          quaerat natus doloribus a aliquid similique quia suscipit, libero
          cumque laboriosam quo fugit odio.
        </p>

        <div className="w-full pt-2">
          <p className="text-xs md:text-sm text-right italic text-gray-600">
            - author name
          </p>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
