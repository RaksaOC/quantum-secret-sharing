from app.schemas.comparison import ComparisonRequest, ComparisonResponse


def compare(req: ComparisonRequest) -> ComparisonResponse:
    """Run the same split three ways with Eve on the channel.

    xor / shamir: Eve copies the share bytes in transit -> eve_got_share=True, detected=False
    quantum:      run_protocol(eve=True) -> error_rate ~0.25 -> detected=True
    """
    raise NotImplementedError("services.comparison_service.compare")
