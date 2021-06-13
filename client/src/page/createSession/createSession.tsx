import React from 'react';
import { Button, Col, Form, Row, Card, Alert } from 'react-bootstrap';
import { createSession } from '../../service/Session';
import { useHistory } from 'react-router-dom';

const languages = ['xml', 'javascript', 'css'];

const CreateSession: React.FC = () => {
    const history = useHistory();

    const [language, setLanguage] = React.useState(languages[0]);
    const [text, setText] = React.useState('');
    const [error, setError] = React.useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            setError('');
            const uuid = await createSession(text, language);
            history.push({ pathname: '/session/' + uuid?.uuid });
        } catch (e) {
            setError('Failed to log in');
        }
    };

    const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value);
    };

    return (
        <Row className="d-flex align-items-center justify-content-center">
            <Col md="auto">
                <Card body style={{ width: '18rem' }}>
                    {error && <Alert variant={'warning'}>{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label>Document title</Form.Label>
                            <Form.Control onChange={handleChangeTitle} type="text" placeholder="Enter title" />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Language</Form.Label>
                            <Form.Control as="select">
                                {languages.map((lang) => (
                                    <option key={lang} onClick={() => setLanguage(lang)}>
                                        {lang}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Create
                        </Button>
                    </Form>
                </Card>
            </Col>
        </Row>
    );
};

export default CreateSession;
