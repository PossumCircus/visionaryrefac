import { useState, useRef, useEffect } from 'react';
import styles from './BoardCollection.module.scss';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import useDeleteCollection from './DeleteCollection';

const mockAPI = 'http://localhost:9999/collection';

function BoardCollection() {
  // db에서 컬렉션 정보 불러오기
  const [collectionImg, setCollectionImg] = useState([]);
  const [collectionTitle, setCollectionTitle] = useState([]);
  const [collectionId, setCollectionId] = useState([]);
  const [totalSlides, setTotalSlides] = useState(0);

  useEffect(() => {
    try {
      fetch(mockAPI)
        .then((response) => response.json())
        .then((items) => {
          const imgUrls = items.map((item) => item.url);
          const imgTitles = items.map((item) => item.title);
          const imgIds = items.map((item) => item.id);
          setCollectionImg(imgUrls);
          setCollectionTitle(imgTitles);
          setCollectionId(imgIds);
        })
        .catch((err) => {
          console.error('에러 발생:', err);
        });
    } catch (err) {
      console.error('비동기 처리 중 오류가 발생했습니다:', err);
    }
  }, []);

  // 슬라이드 개수 가져오기(4 or 8)
  useEffect(() => {
    fetch(mockAPI)
      .then((response) => response.json())
      .then((slides) => {
        setTotalSlides(slides.length);
      });
  }, []);

  // 컬렉션 상세보기 페이지 넘어가기
  const navigate = useNavigate();
  const handleBtnForBoardDetail = (id) => {
    navigate(`/myvisionboardgrid/${id}`);
    console.log('상세보기클릭', id);
  };

  // useDeleteCollection 불러오기
  const handleDeleteButtonClick = useDeleteCollection(
    collectionTitle,
    collectionId,
    collectionImg,
    setCollectionImg,
    setCollectionTitle,
    setCollectionId,
    mockAPI
  );

  //슬라이드 관련
  const slideRef = useRef(null);
  const [index, setIndex] = useState(0); // 슬라이드 인덱스
  const [isSlide, setIsSlide] = useState(false); // 슬라이드 중 여부 체크, 여러번 빠르게 클릭 못하게 하는 역할
  const [x, setX] = useState(0); // 슬라이드 애니메이션 효과를 주기위한 x만큼 이동

  //버튼 클릭으로 슬라이드 넘기기
  const [isClick, setIsClick] = useState(false); // 드래그를 시작하는지 체크해줍니다.
  const [mouseDownClientX, setMouseDownClientX] = useState(0); // 마우스를 클릭한 지점의 x 좌표를 저장
  const [mouseUpClientX, setMouseUpClientX] = useState(0); // 마우스를 땐 지점의 x 좌표를 저장

  //오른쪽 버튼 함수
  // const increaseClick = async () => {
  //   if (isSlide) {
  //     return;
  //   }
  //   setX(-56);
  //   setIsSlide(true);

  //   await setTimeout(() => {
  //     setIndex((prev) => (prev === 7 ? 0 : prev + 1));
  //     setX(0);
  //     setIsSlide(false);
  //   }, 500);
  // };

  //2차 시도 - 오른쪽 버튼 함수
  const increaseClick = async () => {
    if (isSlide) {
      return;
    }
    setX(-56);
    setIsSlide(true);

    await setTimeout(() => {
      setIndex((prev) => (prev + 1) % collectionImg.length); // 변경된 부분
      setX(0);
      setIsSlide(false);
    }, 500);
  };

  //왼쪽 버튼 함수
  // const decreaseClick = async () => {
  //   if (isSlide) {
  //     return;
  //   }
  //   setX(+56);
  //   setIsSlide(true);

  //   await setTimeout(() => {
  //     setIndex((prev) => (prev === 0 ? 7 : prev - 1));
  //     setX(0);
  //     setIsSlide(false);
  //   }, 500);
  // };

  //왼쪽 버튼 함수- 2차시도
  const decreaseClick = async () => {
    if (isSlide) {
      return;
    }
    setX(+56);
    setIsSlide(true);

    await setTimeout(() => {
      setIndex((prev) => (prev - 1) % collectionImg.length); // 변경된 부분
      setX(0);
      setIsSlide(false);
    }, 500);
  };

  // 슬라이드 인덱스 및 개수(이미지 총 8장, 인덱스 0~7)
  // const morePrevImg = index === 1 ? 7 : index === 0 ? 6 : index - 2; //두 슬라이드 전
  // const PrevImg = index === 0 ? 7 : index - 1; // 이전 슬라이드 이동(첫 슬라이드에서 왼쪽-> 마지막 슬라이드)
  // const NextImg = index === 7 ? 0 : index + 1; // 다음 슬라이드 이동(마지막 슬라이드 오른쪽 -> 첫 슬라이드)
  // const moreNextImg = index === 7 ? 1 : index === 6 ? 0 : index + 2; //두 슬라이드 뒤

  // 캐러셀 원형논리 적용(이미지 총 8장, 인덱스 0~7)
  // const morePrevImg = (index + 6) % 8; //두 슬라이드 전
  // const PrevImg = (index + 7) % 8; // 이전 슬라이드 이동(첫 슬라이드에서 왼쪽-> 마지막 슬라이드)
  // const NextImg = (index + 1) % 8; // 다음 슬라이드 이동(마지막 슬라이드 오른쪽 -> 첫 슬라이드)
  // const moreNextImg = (index + 2) % 8; //두 슬라이드 뒤

  // 캐러셀 원형논리 적용 + 이미지가 8개보다 적을 경우 이미지 인덱스가 실제 이미지 수를 넘어가지 않게 함
  const morePrevImg = (index + collectionImg.length - 2) % collectionImg.length; //두 슬라이드 전
  const PrevImg = (index + collectionImg.length - 1) % collectionImg.length; // 이전 슬라이드
  const NextImg = (index + 1) % collectionImg.length; // 다음 슬라이드
  const moreNextImg = (index + 2) % collectionImg.length; //두 슬라이드 뒤

  // 또 수정
  // const morePrevImg = (index + collectionImg.length - 2) % collectionImg.length; //두 슬라이드 전
  // const PrevImg = (index + collectionImg.length - 1) % collectionImg.length; // 이전 슬라이드
  // const CurrentImg = index % collectionImg.length; // 현재 슬라이드
  // const NextImg = (index + 1) % collectionImg.length; // 다음 슬라이드
  // const moreNextImg = (index + 2) % collectionImg.length; //두 슬라이드 뒤

  // console.log('슬라이드 인덱스', index);

  // 버튼 클릭으로 슬라이드 넘기기 시작
  // 마우스 버튼 눌렀을 때
  const onMouseDown = (event) => {
    setIsClick(true);
    setMouseDownClientX(event.pageX);
    // console.log('슬라이드 ref', slideRef);
  };

  // 마우스가 범위 밖일 때
  const onMouseLeave = (event) => {
    setIsClick(false);
  };

  // 마우스 버튼 뗐을 때
  const onMouseUp = (event) => {
    setIsClick(false);
    const imgX = mouseDownClientX - mouseUpClientX;
    // console.log(imgX);

    if (imgX < -100) {
      slideRef.current.style.transform = `translateX(${imgX}px)`;
      increaseClick();
    } else if (imgX > 100) {
      slideRef.current.style.transform = `translateX(${imgX}px)`;
      decreaseClick();
    }
  };

  // 마우스가 범위 안 일 때
  const onMouseMove = (event) => {
    if (!isClick) return;
    event.preventDefault();
    setMouseUpClientX(event.pageX);
    const imgX = mouseDownClientX - mouseUpClientX;
    if (Math.abs(imgX) > 100) {
      slideRef.current.style.transform = `translateX(${imgX}px)`;
    }
  };
  // 버튼 클릭으로 슬라이드 넘기기 끝

  // 자동으로 슬라이드 넘기기 기능
  // useEffect(() => {
  //   const autoPage = setTimeout(() => {
  //     setX(-56);
  //     setIsSlide(true);
  //     setTimeout(() => {
  //       setIndex((prev) => (prev === 8 ? 0 : prev + 1));
  //       setX(0);
  //       setIsSlide(false);
  //     }, 500);
  //   }, 5000);
  //   return () => {
  //     clearTimeout(autoPage);
  //   };
  // }, [index, isClick]);

  // 자동으로 슬라이드 넘기기 기능- 2차시도
  // useEffect(() => {
  //   const autoPage = setTimeout(() => {
  //     setX(-56);
  //     setIsSlide(true);
  //     setTimeout(() => {
  //       setIndex((prev) => (prev === 7 ? 0 : prev + 1));
  //       setX(0);
  //       setIsSlide(false);
  //     }, 500);
  //   }, 5000);
  //   return () => {
  //     clearTimeout(autoPage);
  //   };
  // }, [index, isClick]);

  // 자동으로 슬라이드 넘기기 기능- 3차시도(슬라이드가 4개 또는 8개인 경우)
  useEffect(() => {
    const autoPage = setTimeout(() => {
      setX(-56);
      setIsSlide(true);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % totalSlides); // mod operator for cycling slides
        setX(0);
        setIsSlide(false);
      }, 500);
    }, 5000);
    return () => {
      clearTimeout(autoPage);
    };
  }, [index, isClick, totalSlides]);

  // 리턴
  return (
    <div className={styles.wrapper}>
      {/* 왼쪽 버튼 */}
      <button className={styles.leftButton} onClick={decreaseClick}>
        <FiChevronLeft />
      </button>

      {/* 오른쪽 버튼 */}
      <button className={styles.rightButton} onClick={increaseClick}>
        <FiChevronRight />
      </button>

      {/* 가로 정렬 등 전체 스타일 시작  */}
      <div
        className={styles.row}
        key={index}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onMouseMove={onMouseMove}
        ref={slideRef}
        style={{
          transform: `translateX(${x}vw)`,
        }}
      >
        {/* 전전 슬라이드에 적용 */}
        <div className={styles.container}>
          <img
            className={styles.priviewImg}
            src={collectionImg[morePrevImg]}
          ></img>
        </div>

        {/* 전 슬라이드에 적용 */}
        <div className={styles.container}>
          <img className={styles.priviewImg} src={collectionImg[PrevImg]}></img>
        </div>

        {/* 이미지 섹션 시작 */}
        <div className={styles.imgWrapper}>
          {/* 한 화면에 세 개 슬라이드 보이게 */}
          <img className={styles.img} src={collectionImg[index]}></img>

          {/* 이미지 설명 박스 */}
          {/* {!isSlide ? ( //슬라이딩 중이 아니면
            <div className={styles.imgDes}>
              <div className={styles.title}>{collectionTitle[index]}</div>
            </div>
          ) : null} */}

          {/* 이미지 설명 박스 2차 시도  */}
          <div className={styles.imgDes}>
            <div className={styles.title}>{collectionTitle[index]}</div>
          </div>
        </div>
        {/* 이미지 섹션 끝 */}

        {/* 다음 슬라이드에 적용 */}
        <div className={styles.container}>
          <img className={styles.priviewImg} src={collectionImg[NextImg]}></img>
        </div>

        {/* 다다음 슬라이드에 적용 */}
        <div className={styles.container}>
          <img
            className={styles.priviewImg}
            src={collectionImg[moreNextImg]}
          ></img>
        </div>
      </div>

      {/* 가로 정렬 등 전체 스타일 끝  */}
      <div className={styles.buttonBox}>
        <button
          className={styles.deleteButton}
          onClick={() => handleDeleteButtonClick(index)}
        >
          선택 컬렉션 삭제하기
        </button>

        <button
          className={styles.detailButton}
          onClick={() => handleBtnForBoardDetail(collectionId[index])}
        >
          선택 컬렉션 상세보기
        </button>
      </div>
    </div>
  );
}

export default BoardCollection;