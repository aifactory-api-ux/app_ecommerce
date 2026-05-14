from datetime import date


def parse_date(date_str: str) -> date:
    return date.fromisoformat(date_str)


def validate_date_range(start_date: date, end_date: date) -> None:
    if start_date > end_date:
        raise ValueError("start_date cannot be greater than end_date")