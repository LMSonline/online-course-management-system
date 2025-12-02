"""
Tests for LLM client implementations.
"""

import pytest
from unittest.mock import AsyncMock, patch
import httpx

from app.infra.llm_client import DummyLLMClient, Llama3Client


@pytest.mark.asyncio
async def test_dummy_llm_client_generate(dummy_llm_client):
    """Test DummyLLMClient generates echo response."""
    prompt = "Hello, how are you?"
    result = await dummy_llm_client.generate(prompt)
    
    assert prompt[:1000] in result
    assert "[LLM demo response]" in result


@pytest.mark.asyncio
async def test_dummy_llm_client_with_params(dummy_llm_client):
    """Test DummyLLMClient ignores params but doesn't crash."""
    result = await dummy_llm_client.generate(
        "test",
        system_prompt="You are helpful",
        temperature=0.7,
        max_tokens=100,
    )
    assert isinstance(result, str)


@pytest.mark.asyncio
async def test_llama3_client_success():
    """Test Llama3Client with successful API call."""
    mock_response = {
        "choices": [
            {
                "message": {
                    "content": "This is a test response"
                }
            }
        ]
    }
    
    with patch("httpx.AsyncClient") as mock_client:
        mock_post = AsyncMock()
        mock_post.raise_for_status = AsyncMock()
        mock_post.json.return_value = mock_response
        mock_client.return_value.__aenter__.return_value.post = AsyncMock(return_value=mock_post)
        
        client = Llama3Client(
            api_base="https://api.test.com/v1",
            api_key="test-key",
            model_name="llama-3-8b-instruct",
        )
        
        result = await client.generate("test prompt")
        
        assert result == "This is a test response"
        # Verify correct URL and headers were used
        call_args = mock_client.return_value.__aenter__.return_value.post.call_args
        assert "chat/completions" in call_args[0][0]
        assert call_args[1]["headers"]["Authorization"] == "Bearer test-key"
        assert call_args[1]["json"]["model"] == "llama-3-8b-instruct"


@pytest.mark.asyncio
async def test_llama3_client_with_system_prompt():
    """Test Llama3Client includes system prompt in messages."""
    mock_response = {
        "choices": [{"message": {"content": "Response"}}]
    }
    
    with patch("httpx.AsyncClient") as mock_client:
        mock_post = AsyncMock()
        mock_post.raise_for_status = AsyncMock()
        mock_post.json.return_value = mock_response
        mock_client.return_value.__aenter__.return_value.post = AsyncMock(return_value=mock_post)
        
        client = Llama3Client(
            api_base="https://api.test.com/v1",
            api_key="test-key",
            model_name="llama-3-8b-instruct",
        )
        
        await client.generate("user prompt", system_prompt="You are helpful")
        
        # Verify system prompt was included
        call_args = mock_client.return_value.__aenter__.return_value.post.call_args
        messages = call_args[1]["json"]["messages"]
        assert len(messages) == 2
        assert messages[0]["role"] == "system"
        assert messages[0]["content"] == "You are helpful"
        assert messages[1]["role"] == "user"
        assert messages[1]["content"] == "user prompt"


@pytest.mark.asyncio
async def test_llama3_client_error_handling():
    """Test Llama3Client raises exception on API error."""
    with patch("httpx.AsyncClient") as mock_client:
        mock_post = AsyncMock()
        mock_post.raise_for_status.side_effect = httpx.HTTPStatusError(
            "Error", request=AsyncMock(), response=AsyncMock()
        )
        mock_client.return_value.__aenter__.return_value.post = AsyncMock(return_value=mock_post)
        
        client = Llama3Client(
            api_base="https://api.test.com/v1",
            api_key="test-key",
            model_name="llama-3-8b-instruct",
        )
        
        with pytest.raises(httpx.HTTPStatusError):
            await client.generate("test prompt")

