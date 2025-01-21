import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Col,
  Container,
  Dropdown,
  DropdownButton,
  Form,
  Pagination,
  Row,
  Spinner,
} from "react-bootstrap";

const SearchQuestions = () => {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [questions, setQuestions] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [type, setType] = useState("");

  const searchQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = new URL("http://localhost:5000/search");
      const params = {
        page,
        limit,
        type,
      };

      if (query) {
        params.query = query;
      }

      Object.keys(params).forEach(
        (key) => params[key] === "" && delete params[key]
      );

      url.search = new URLSearchParams(params).toString();

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await res.json();
      setQuestions(data.questions);
      setTotalCount(data.totalCount);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query) {
        searchQuestions();
      } else {
        setQuestions([]);
        setTotalCount(0);
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [query, page, type]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <Container>
      <h1 className="my-4 text-center">Search Questions</h1>

      <Row className="mb-4">
        <Col xs={12} md={8} className="mx-auto">
          <Form onSubmit={(e) => e.preventDefault()}>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Search questions"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="mb-3"
              />
            </Form.Group>
          </Form>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col xs={12} md={4} className="mx-auto">
          <DropdownButton
            variant="secondary"
            title={type || "Filter by Type"}
            onSelect={(e) => setType(e)}
            className="mb-3"
          >
            <Dropdown.Item eventKey="">All</Dropdown.Item>
            <Dropdown.Item eventKey="MCQ">MCQ</Dropdown.Item>
            <Dropdown.Item eventKey="ANAGRAM">ANAGRAM</Dropdown.Item>
            <Dropdown.Item eventKey="READ_ALONG">READ_ALONG</Dropdown.Item>
            <Dropdown.Item eventKey="CONTENT_ONLY">CONTENT_ONLY</Dropdown.Item>
          </DropdownButton>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" className="mt-4">
          {error}
        </Alert>
      )}

      {loading && !error && (
        <div className="d-flex justify-content-center mt-4">
          <Spinner animation="border" variant="primary" />
        </div>
      )}

      {questions.length > 0 && (
        <div className="mt-4">
          <h5>{totalCount} Questions Found</h5>
          <ul className="list-group">
            {questions.map((question) => (
              <li key={question.id} className="list-group-item">
                <strong>{question.title}</strong> ({question.type})
                {question.type === "MCQ" && (
                  <ul className="mt-2">
                    {question.options.map((option, index) => (
                      <li key={index}>{option.text}</li>
                    ))}
                  </ul>
                )}
                {question.type === "ANAGRAM" && (
                  <ul className="mt-2">
                    {question.blocks.map((block, index) => (
                      <li key={index}>{block.text}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          <div className="d-flex justify-content-center mt-4">
            <Pagination>
              <Pagination.Prev
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
              />
              <Pagination.Next
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
              />
            </Pagination>
          </div>
        </div>
      )}

      {questions.length === 0 && !loading && !error && query && (
        <Alert variant="info" className="mt-4">
          No questions found.
        </Alert>
      )}
    </Container>
  );
};

export default SearchQuestions;
