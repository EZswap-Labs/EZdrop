// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import {ISeaDrop1155TokenContractMetadata} from "./interfaces/ISeaDrop1155TokenContractMetadata.sol"; 

import {ERC1155} from "openzeppelin-contracts/token/ERC1155/ERC1155.sol";

import {IERC165} from "openzeppelin-contracts/utils/introspection/IERC165.sol";

import {Ownable} from "openzeppelin-contracts/access/Ownable.sol";

/**
 * @title  ERC1155ContractMetadata
 * @author yycz
 * @notice ERC1155ContractMetadata is a token contract that extends ERC1155
 *         with additional metadata and ownership capabilities.
 */
contract ERC1155ContractMetadata is
    ERC1155,
    Ownable,
    ISeaDrop1155TokenContractMetadata
{
    /// @notice Track the max supply.
    uint256 _maxSupply;

    /**
     * @dev Reverts if the sender is not the owner or the contract itself.
     *      This function is inlined instead of being a modifier
     *      to save contract space from being inlined N times.
     */
    function _onlyOwnerOrSelf() internal view {
        if (
            _cast(msg.sender == owner()) | _cast(msg.sender == address(this)) ==
            0
        ) {
            revert OnlyOwner();
        }
    }

    /**
     * @notice Deploy the token contract with its name and symbol.
     */
    constructor(string memory _uri) ERC1155(_uri) {}

    /**
     * @notice Sets the URI for the token metadata and emits an event.
     *
     * @param newuri The new  URI to set.
     */
    function setURI(string memory newuri) external {
        // Ensure the sender is only the owner or contract itself.
        _onlyOwnerOrSelf();

        _setURI(newuri);

        // Emit an event with the update.
        emit URIUpdated(newuri);
    }

    /**
     * @notice Returns whether the interface is supported.
     *
     * @param interfaceId The interface id to check against.
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC1155)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    /**
     * @notice Sets the max token supply and emits an event.
     *
     * @param newMaxSupply The new max supply to set.
     */
    function setMaxSupply(uint256 newMaxSupply) external {
        // Ensure the sender is only the owner or contract itself.
        _onlyOwnerOrSelf();

        // Ensure the max supply does not exceed the maximum value of uint64.
        if (newMaxSupply > 2**64 - 1) {
            revert CannotExceedMaxSupplyOfUint64(newMaxSupply);
        }

        // Set the new max supply.
        _maxSupply = newMaxSupply;

        // Emit an event with the update.
        emit MaxSupplyUpdated(newMaxSupply);
    }

    /**
     * @notice Returns the max token supply.
     */
    function maxSupply() public view returns (uint256) {
        return _maxSupply;
    }

    /**
     * @dev Internal pure function to cast a `bool` value to a `uint256` value.
     *
     * @param b The `bool` value to cast.
     *
     * @return u The `uint256` value.
     */
    function _cast(bool b) internal pure returns (uint256 u) {
        assembly {
            u := b
        }
    }
}
