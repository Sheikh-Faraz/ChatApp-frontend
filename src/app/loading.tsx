export default function LoadingPage() {
  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-white bg-opacity-100">
      <span className="loading loading-dots loading-lg m-auto block" />
    </div>
  );
}

// the div tag around the span was not in the code video i add that and the css to it to make it take
// the full screen width the video version only had the span

// NOTE: The prettier file form the tutorial was not working and was another name i.e the name of file was different
// NOTE SOLUTION: I changed the file name to "prettierrc" and changed the code in it and it works
