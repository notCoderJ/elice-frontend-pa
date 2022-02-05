import { useCallback, useState } from 'react';
import api from '../api';
import { Price } from '../interface/query';

interface OptionsType {
  filterConditions?: string;
  offset?: number;
}

interface FetchDataType {
  (url: string, options?: OptionsType): void;
}

export interface CardInfo {
  title: string;
  description: string;
  price: Price;
}

interface DataType {
  totalCount: number;
  courses: CardInfo[];
}

const useFetchApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<DataType | null>(null);
  const [error, setError] = useState<string | null>(null);

  // TODO: Data count 어떻게 할지...?
  const InitStatus = () => {
    setData(null);
    setError(null);
  };

  const fetchApi: FetchDataType = useCallback(async (url, options) => {
    try {
      setIsLoading(true);
      InitStatus();
      const res = await api.get(url, {
        params: {
          filter_conditions: options?.filterConditions || '',
          offset: (options?.offset || 0) * 20,
          count: 20,
        },
      });

      setIsLoading(false);
      const { _result, ...resData } = res.data;
      if (_result.status !== 'ok') {
        throw new Error(resData.fail_message);
      }

      setData({
        totalCount: resData.course_count,
        courses: resData.courses.map((course: { [key: string]: any }) => ({
          title: course.title,
          description: course.short_description,
          price: { enroll_type: course.enroll_type, is_free: course.is_free },
        })),
      });

      // 테스트 로그
      // console.log(res);
    } catch (err) {
      setError(err as string);
    }
  }, []);

  // TODO: 미구현
  const cancelRequest = useCallback(() => console.log('clean~'), []);

  return { isLoading, data, error, fetchApi, cancelRequest };
};

export default useFetchApi;
