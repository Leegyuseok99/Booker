import { useEffect } from "react";

const useBeforeUnload = (callback) => {
  // useEffect(() => {
  //     const handleBeforeUnload = (event) => {
  //         // 브라우저를 닫을 때만 로컬 스토리지에서 토큰을 제거합니다.
  //         if (callback && event.type === 'beforeunload') {
  //             callback();
  //         }
  //     };
  //
  //     window.addEventListener("beforeunload", handleBeforeUnload);
  //
  //     return () => {
  //         window.removeEventListener("beforeunload", handleBeforeUnload);
  //     };
  // }, [callback]);
};

export default useBeforeUnload;
