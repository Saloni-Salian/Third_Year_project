import unittest

from pii_model import sanitise_data

class TestSanitise(unittest.TestCase):
    def test_return_values(self):
        text = 'I live in London.'
        check_value = {'text': text , 'ents': [{'start': 10, 'end': 16, 'label': 'LOC'}], 'title': None}
        result = sanitise_data([{'entity_group': 'LOC', 'score': 0.9999999, 'word': 'london', 'start': 10, 'end': 16}])
        self.assertEqual(result, check_value)

if __name__ == 'main':
    unittest.main()