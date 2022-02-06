import { useCallback, useState, useRef } from 'react';
import axios, { CancelTokenSource } from 'axios';
import api from '../api';
import { CardInfo } from '../interface/card';

interface OptionsType {
  filterConditions?: string;
  offset?: number;
}

interface FetchDataType {
  (url: string, options?: OptionsType): void;
}

interface DataType {
  courses: CardInfo[];
}

const useFetchApi = () => {
  const source = useRef<CancelTokenSource | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [data, setData] = useState<DataType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const initStatus = useCallback(() => {
    setError(null);
    setData(null);
    setIsLoading(true);
  }, []);

  const cancel = useCallback(() => {
    if (source.current !== null) {
      source.current.cancel();
      source.current = null;
    }
  }, []);

  const fetchApi: FetchDataType = useCallback(
    async (url, options) => {
      try {
        initStatus();
        cancel();
        source.current = axios.CancelToken.source();

        const res = await api.get(url, {
          cancelToken: source.current.token,
          params: {
            filter_conditions: options?.filterConditions || '',
            offset: (options?.offset || 0) * 20,
            count: 20,
          },
        });

        const { _result, ...resData } = res.data;
        if (_result.status !== 'ok') {
          throw new Error(resData.fail_message);
        }

        setTotalCount(resData.course_count);
        setData({
          courses: resData.courses.map((course: { [key: string]: any }) => ({
            title: course.title,
            description: course.short_description,
            price: { enroll_type: course.enroll_type, is_free: course.is_free },
            logo: course.logo_file_url,
          })),
        });
      } catch (err) {
        setError(err as string);
        setTotalCount(0);
      } finally {
        setIsLoading(false);
      }
    },
    [initStatus, cancel],
  );

  return { isLoading, totalCount, data, error, fetchApi, cancel };
};

export default useFetchApi;
